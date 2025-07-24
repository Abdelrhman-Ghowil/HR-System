import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  ApiUser,
  CreateUserRequest,
  UpdateUserRequest,
  ApiEmployee,
  ApiEmployeeData,
  ApiUserData,
  CreateEmployeeRequest,
  CreateEmployeeUserRequest,
  UpdateEmployeeRequest,
  UpdateEmployeeUserRequest,
  ApiCompany,
  CreateCompanyRequest,
  ApiDepartment,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ApiEvaluation,
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  AuthHeaders,
  EmployeeQueryParams,
  DepartmentQueryParams,
  EvaluationQueryParams
} from '../types/api';

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and errors
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
                refresh: refreshToken
              });
              const { access } = response.data;
              this.saveToken(access);
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearToken();
            window.location.href = '/';
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );

    // Load token from localStorage on initialization
    this.loadToken();
  }

  // Token management
  private loadToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Error handling
  private handleError(error: Error | { response?: { data?: { message?: string; error?: string; details?: unknown }; status: number }; request?: unknown; code?: string }): ApiError {
    console.error('Full API Error Details:', {
      message: error.message,
      code: (error as any).code,
      response: error.response,
      request: error.request ? 'Request made but no response' : 'No request made'
    });

    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.data?.error || `Server error (${error.response.status})`;
      return {
        message: errorMessage,
        status: error.response.status,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Request was made but no response received
      const errorCode = (error as any).code;
      let networkMessage = 'Network error - please check your connection';
      
      if (errorCode === 'ENOTFOUND') {
        networkMessage = 'Cannot reach server - DNS resolution failed';
      } else if (errorCode === 'ECONNREFUSED') {
        networkMessage = 'Connection refused - server may be down';
      } else if (errorCode === 'ETIMEDOUT') {
        networkMessage = 'Request timeout - server took too long to respond';
      } else if (errorCode === 'ERR_NETWORK') {
        networkMessage = 'Network error - CORS policy or connectivity issue. Please check if the API server allows cross-origin requests.';
      }
      
      return {
        message: networkMessage,
        status: 0,
      };
    } else {
      // Something else happened in setting up the request
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<{access: string, refresh: string}> = await this.api.post('/api/auth/login/', credentials);
    const { access, refresh } = response.data;

    // Save tokens to localStorage and instance
    this.saveToken(access);
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }

    // Extract user info from JWT token
    const user = this.extractUserFromToken(access);
    
    console.log('Login successful, token saved:', {
      tokenLength: access.length,
      hasRefresh: !!refresh,
      userId: user.id,
      userRole: user.role
    });
    
    return {
      access,
      refresh,
      user
    };
  }

  // Helper method to extract user info from JWT token
  private extractUserFromToken(token: string): ApiUser {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload.user_id || payload.id || 'unknown',
        username: payload.username || payload.name?.split(' ')[0] || 'user',
        email: payload.email || '',
        first_name: payload.first_name || payload.name?.split(' ')[0] || '',
        last_name: payload.last_name || payload.name?.split(' ').slice(1).join(' ') || '',
        name: payload.name || payload.username || 'Unknown User',
        role: payload.role || 'EMP'
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      throw new Error('Invalid token format');
    }
  }

  async logout(): Promise<void> {
    try {
      // Optionally call logout endpoint if your backend supports it
      // await this.api.post('/api/auth/logout/');
    } catch (error) {
      // Ignore logout errors, still clear local token
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  // Token refresh method
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response: AxiosResponse<{ access: string }> = await this.api.post('/api/auth/refresh/', {
        refresh: refreshToken
      });

      const { access } = response.data;
      this.saveToken(access);
      return access;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  // User management methods
  async createUser(userData: CreateUserRequest): Promise<ApiUser> {
    const response: AxiosResponse<ApiUser> = await this.api.post('/api/accounts/users/', userData);
    return response.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiUser> {
    const response: AxiosResponse<ApiUser> = await this.api.patch(`/api/accounts/users/${userId}/`, userData);
    return response.data;
  }

  async getUser(userId: string): Promise<ApiUser> {
    const response: AxiosResponse<ApiUser> = await this.api.get(`/api/accounts/users/${userId}/`);
    return response.data;
  }

  // Employee methods - combining data from two endpoints
  async getEmployees(params?: EmployeeQueryParams): Promise<ApiEmployee> {
    console.log('Fetching employees with token:', {
      hasToken: !!this.getToken(),
      tokenLength: this.getToken()?.length || 0,
      isAuthenticated: this.isAuthenticated()
    });
    
    try {
      // Fetch employee data from /api/employees/
      const employeeResponse: AxiosResponse<ApiEmployeeData> = await this.api.get('/api/employees/', {
        params,
      });
      
      console.log('Employee data fetched successfully:', {
        response:employeeResponse.data,
        count: employeeResponse.data?.length || 0
      });
      
      // Fetch user data from /api/accounts/users/
      const userResponse: AxiosResponse<ApiUserData> = await this.api.get('/api/accounts/users/');
      
      console.log('User data fetched successfully:', {
        count: userResponse.data?.length || 0,
      });
      
      // Create a map of user data by user_id for quick lookup
      const userMap = new Map<string, ApiUserData>();
      if (userResponse.data) {
        userResponse.data.forEach(user => {
          userMap.set(user.user_id, user);
        });
      }
      
      // Merge employee and user data
      const mergedEmployees: ApiEmployee[] = (employeeResponse.data || []).map(employee => {
        const user = userMap.get(employee.user_id);
        return this.mergeEmployeeData(employee, user);
      });
      
      console.log('Employees merged successfully:', {
        totalEmployees: mergedEmployees.length,
        sampleEmployee: mergedEmployees[0] ? {
          id: mergedEmployees[0].employee_id,
          name: mergedEmployees[0].name,
          email: mergedEmployees[0].email
        } : null
      });
      
      return {
        count: employeeResponse.data?.length || 0,
        // next: employeeResponse.data?.next || null,
        // previous: employeeResponse.data?.previous || null,
        results: mergedEmployees
      };
    } catch (error) {
      console.error('Error fetching employees:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async getEmployee(employeeId: string): Promise<ApiEmployee> {
    // Fetch employee data
    const employeeResponse: AxiosResponse<ApiEmployeeData> = await this.api.get(`/api/employees/${employeeId}/`);
    
    // Fetch corresponding user data
    const userResponse: AxiosResponse<ApiUserData> = await this.api.get(`/api/accounts/users/${employeeResponse.data.user_id}/`);
    
    return this.mergeEmployeeData(employeeResponse.data, userResponse.data);
  }

  async createEmployee(employeeData: CreateEmployeeRequest, userData: CreateEmployeeUserRequest): Promise<ApiEmployee> {
    // First create the user
    const userResponse: AxiosResponse<ApiUserData> = await this.api.post('/api/accounts/users/', userData);
    
    // Then create the employee record with the user_id
    const employeePayload = {
      ...employeeData,
      user_id: userResponse.data.user_id
    };
    
    const employeeResponse: AxiosResponse<ApiEmployeeData> = await this.api.post('/api/employees/', employeePayload);
    
    return this.mergeEmployeeData(employeeResponse.data, userResponse.data);
  }

  async updateEmployee(employeeId: string, employeeData?: UpdateEmployeeRequest, userData?: UpdateEmployeeUserRequest): Promise<ApiEmployee> {
    // Get current employee to find user_id
    const currentEmployee = await this.getEmployee(employeeId);
    
    // Update employee data if provided
    if (employeeData) {
      await this.api.patch(`/api/employees/${employeeId}/`, employeeData);
    }
    
    // Update user data if provided
    if (userData) {
      await this.api.patch(`/api/accounts/users/${currentEmployee.user_id}/`, userData);
    }
    
    // Return updated employee
    return this.getEmployee(employeeId);
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    // Get employee to find user_id
    const employee = await this.getEmployee(employeeId);
    
    // Delete employee record first
    await this.api.delete(`/api/employees/${employeeId}/`);
    
    // Optionally delete user record (uncomment if needed)
    // await this.api.delete(`/api/accounts/users/${employee.user_id}/`);
  }

  // Helper method to merge employee and user data
  private mergeEmployeeData(employeeData: ApiEmployeeData, userData?: ApiUserData): ApiEmployee {
    // Handle case where userData is not found - create a fallback employee record
    const fallbackUserData = userData || {
      user_id: employeeData.user_id,
      name: 'Unknown User',
      email: '',
      phone: '',
      avatar: '',
      title: 'Unknown Position',
      role: 'Employee' as const
    };
    
    return {
      employee_id: employeeData.employee_id,
      name: fallbackUserData.name || 'Unknown User',
      email: fallbackUserData.email || '',
      phone: fallbackUserData.phone || '',
      avatar: fallbackUserData.avatar || '',
      department: (employeeData.departments && employeeData.departments.length > 0) ? employeeData.departments[0] : '',
      position: fallbackUserData.title || 'Unknown Position',
      role: fallbackUserData.role || 'Employee',
      managerial_weight: employeeData.managerial_level || 'IC',
      status: employeeData.status || 'ACTIVE',
      company_name: '', // Will need to fetch company name separately if needed
      join_date: employeeData.join_date || new Date().toISOString(),
      created_at: employeeData.created_at || new Date().toISOString(),
      updated_at: employeeData.updated_at || new Date().toISOString(),
      user_id: employeeData.user_id,
      company_id: employeeData.company
    };
  }

  // Company methods
  async getCompanies(): Promise<PaginatedResponse<ApiCompany>> {
    const response: AxiosResponse<PaginatedResponse<ApiCompany>> = await this.api.get('/api/org/companies/');
    return response.data;
  }

  async getCompany(companyId: string): Promise<ApiCompany> {
    const response: AxiosResponse<ApiCompany> = await this.api.get(`/api/org/companies/${companyId}/`);
    return response.data;
  }

  async createCompany(companyData: CreateCompanyRequest): Promise<ApiCompany> {
    const response: AxiosResponse<ApiCompany> = await this.api.post('/api/org/companies/create/', companyData);
    return response.data;
  }

  async updateCompany(companyId: string, companyData: Partial<CreateCompanyRequest>): Promise<ApiCompany> {
    const response: AxiosResponse<ApiCompany> = await this.api.patch(`/api/org/companies/${companyId}/`, companyData);
    return response.data;
  }

  async deleteCompany(companyId: string): Promise<void> {
    await this.api.delete(`/api/org/companies/${companyId}/`);
  }

  // Department methods
  async getDepartments(params?: DepartmentQueryParams): Promise<PaginatedResponse<ApiDepartment>> {
    const response: AxiosResponse<PaginatedResponse<ApiDepartment>> = await this.api.get('/api/org/departments/', {
      params,
    });
    return response.data;
  }

  async getDepartment(departmentId: string): Promise<ApiDepartment> {
    const response: AxiosResponse<ApiDepartment> = await this.api.get(`/api/org/departments/${departmentId}/`);
    return response.data;
  }

  async createDepartment(departmentData: CreateDepartmentRequest): Promise<ApiDepartment> {
    const response: AxiosResponse<ApiDepartment> = await this.api.post('/api/org/departments/create/', departmentData);
    return response.data;
  }

  async updateDepartment(departmentId: string, departmentData: UpdateDepartmentRequest): Promise<ApiDepartment> {
    const response: AxiosResponse<ApiDepartment> = await this.api.patch(`/api/org/departments/${departmentId}/`, departmentData);
    return response.data;
  }

  async deleteDepartment(departmentId: string): Promise<void> {
    await this.api.delete(`/api/org/departments/${departmentId}/`);
  }

  // Evaluation methods
  async getEvaluations(params?: EvaluationQueryParams): Promise<PaginatedResponse<ApiEvaluation>> {
    const response: AxiosResponse<PaginatedResponse<ApiEvaluation>> = await this.api.get('/api/evaluations/', {
      params,
    });
    return response.data;
  }

  async getEvaluation(evaluationId: string): Promise<ApiEvaluation> {
    const response: AxiosResponse<ApiEvaluation> = await this.api.get(`/api/evaluations/${evaluationId}/`);
    return response.data;
  }

  async createEvaluation(evaluationData: CreateEvaluationRequest): Promise<ApiEvaluation> {
    const response: AxiosResponse<ApiEvaluation> = await this.api.post('/api/evaluations/', evaluationData);
    return response.data;
  }

  async updateEvaluation(evaluationId: string, evaluationData: UpdateEvaluationRequest): Promise<ApiEvaluation> {
    const response: AxiosResponse<ApiEvaluation> = await this.api.patch(`/api/evaluations/${evaluationId}/`, evaluationData);
    return response.data;
  }

  async deleteEvaluation(evaluationId: string): Promise<void> {
    await this.api.delete(`/api/evaluations/${evaluationId}/`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (basic JWT check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      // If token parsing fails, consider it invalid
      return false;
    }
  }

  // Test API connectivity
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing API connection to:', this.api.defaults.baseURL);
      // Use a valid API endpoint instead of root URL to avoid 404 errors
      const response = await this.api.get('/api/auth/validate/', { timeout: 5000 });
      return {
        success: true,
        message: 'API connection successful',
        details: { status: response.status, url: this.api.defaults.baseURL }
      };
    } catch (error: any) {
      // If the endpoint requires authentication, that's still a successful connection
      if (error.response?.status === 401) {
        return {
          success: true,
          message: 'API connection successful (authentication required)',
          details: { status: error.response.status, url: this.api.defaults.baseURL }
        };
      }
      const apiError = this.handleError(error);
      return {
        success: false,
        message: apiError.message,
        details: { status: apiError.status, url: this.api.defaults.baseURL }
      };
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Method to manually set token (useful for testing or external auth)
  setToken(token: string): void {
    this.saveToken(token);
  }

  // Validate current token
  async validateToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }
      
      // Make a simple request to validate token
      await this.api.get('/api/auth/validate/');
      return true;
    } catch (error) {
      this.clearToken();
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;

// Export the class for testing or multiple instances if needed
export { ApiService };