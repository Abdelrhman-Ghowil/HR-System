// API Types for HR Evaluation System Backend Integration

// Authentication Types
export interface LoginRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  phone?: string;
  role: UserRole;
  title?: string;
  avatar?: string;
}

export type UserRole = 'ADMIN' | 'HR' | 'HOD' | 'LM' | 'EMP';

// User Management Types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  name: string;
  phone?: string;
  role: UserRole;
  title?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  title?: string;
  avatar?: string;
}

// Employee Types - Raw API responses
export interface ApiEmployeeData {
  employee_id: string;
  user_id: string;
  company: string;
  departments: string[];
  managerial_level: ManagerialLevel;
  status: EmployeeStatus;
  join_date: string;
}

export interface ApiUserData {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  title: string;
}

// Combined Employee interface for frontend use
export interface ApiEmployee {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  position: string;
  role: UserRole;
  managerial_weight: ManagerialLevel;
  status: EmployeeStatus;
  company_name: string;
  join_date: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  company_id: string;
}

export type ManagerialLevel = 'IC' | 'SUPERVISORY' | 'MIDDLE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface CreateEmployeeRequest {
  user_id: string;
  company: string;
  departments?: string[];
  managerial_level: ManagerialLevel;
  status: EmployeeStatus;
  join_date: string;
}

export interface CreateEmployeeUserRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  title: string;
  avatar?: string;
}

export interface UpdateEmployeeRequest {
  managerial_level?: ManagerialLevel;
  status?: EmployeeStatus;
  join_date?: string;
  departments?: string[];
}

export interface UpdateEmployeeUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  title?: string;
  avatar?: string;
}

// Company Types
export interface ApiCompany {
  id: string;
  name: string;
  industry?: string;
  size?: CompanySize;
  description?: string;
  website?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export type CompanySize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface CreateCompanyRequest {
  name: string;
  industry?: string;
  size?: CompanySize;
  description?: string;
  website?: string;
  address?: string;
}

// Department Types
export interface ApiDepartment {
  id: string;
  name: string;
  employee_count?: number;
  company: string;
  manager?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentRequest {
  name: string;
  employee_count?: number;
  company: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  employee_count?: number;
  manager?: string;
}

// Evaluation Types
export interface ApiEvaluation {
  id: string;
  employee_id: string;
  type: EvaluationType;
  status: EvaluationStatus;
  period: string;
  score?: number;
  reviewer_id?: string;
  objectives?: ApiObjective[];
  created_at: string;
  updated_at: string;
}

export type EvaluationType = 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'PROBATION';
export type EvaluationStatus = 
  | 'DRAFT' 
  | 'PENDING_HOD' 
  | 'PENDING_HR' 
  | 'EMPLOYEE_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'COMPLETED';

export interface CreateEvaluationRequest {
  employee_id: string;
  type: EvaluationType;
  status: EvaluationStatus;
  period: string;
  score?: number;
}

export interface UpdateEvaluationRequest {
  status?: EvaluationStatus;
  score?: number;
  objectives?: CreateObjectiveRequest[];
  reviewer_id?: string;
}

// Objective Types
export interface ApiObjective {
  id: string;
  evaluation_id: string;
  title: string;
  description: string;
  weight: number;
  target?: number;
  achieved?: number;
  status?: ObjectiveStatus;
}

export type ObjectiveStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CreateObjectiveRequest {
  title: string;
  description: string;
  weight: number;
  target?: number;
  achieved?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// Request Configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Auth Headers
export interface AuthHeaders {
  Authorization: string;
  'Content-Type': string;
}

// Query Parameters
export interface EmployeeQueryParams {
  company?: string;
  department?: string;
  status?: EmployeeStatus;
  role?: UserRole;
  page?: number;
  page_size?: number;
}

export interface DepartmentQueryParams {
  company?: string;
  page?: number;
  page_size?: number;
}

export interface EvaluationQueryParams {
  employee_id?: string;
  type?: EvaluationType;
  status?: EvaluationStatus;
  period?: string;
  page?: number;
  page_size?: number;
}