// Authentication debugging utility
// This utility helps debug authentication and token storage issues

export interface AuthDebugInfo {
  hasToken: boolean;
  tokenLength: number;
  isTokenValid: boolean;
  tokenExpiry?: Date;
  userId?: string;
  userRole?: string;
  localStorageKeys: string[];
  apiBaseUrl: string;
}

export class AuthDebugger {
  static getAuthInfo(): AuthDebugInfo {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');
    
    let tokenExpiry: Date | undefined;
    let userId: string | undefined;
    let userRole: string | undefined;
    let isTokenValid = false;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        tokenExpiry = new Date(payload.exp * 1000);
        userId = payload.user_id || payload.id;
        userRole = payload.role;
        isTokenValid = payload.exp > Math.floor(Date.now() / 1000);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    
    return {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      isTokenValid,
      tokenExpiry,
      userId,
      userRole,
      localStorageKeys: Object.keys(localStorage),
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'Not set'
    };
  }
  
  static logAuthInfo(): void {
    const info = this.getAuthInfo();
    console.group('🔐 Authentication Debug Info');
    console.log('Token Status:', {
      hasToken: info.hasToken,
      tokenLength: info.tokenLength,
      isValid: info.isTokenValid,
      expiry: info.tokenExpiry?.toISOString(),
      timeUntilExpiry: info.tokenExpiry ? 
        Math.floor((info.tokenExpiry.getTime() - Date.now()) / 1000) + ' seconds' : 
        'N/A'
    });
    console.log('User Info:', {
      userId: info.userId,
      userRole: info.userRole
    });
    console.log('Storage:', {
      localStorageKeys: info.localStorageKeys,
      apiBaseUrl: info.apiBaseUrl
    });
    console.groupEnd();
  }
  
  static clearAllAuthData(): void {
    console.log('🧹 Clearing all authentication data...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    console.log('✅ Authentication data cleared');
  }
  
  static validateTokenFormat(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Invalid JWT format: should have 3 parts');
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp) {
        console.error('❌ Token missing expiration');
        return false;
      }
      
      if (!payload.user_id && !payload.id) {
        console.error('❌ Token missing user ID');
        return false;
      }
      
      console.log('✅ Token format is valid');
      return true;
    } catch (error) {
      console.error('❌ Error validating token format:', error);
      return false;
    }
  }
  
  static async testApiConnection(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    console.group('🌐 Testing API Connection');
    console.log('Base URL:', baseUrl);
    console.log('Has Token:', !!token);
    
    if (!token) {
      console.warn('⚠️ No token available for testing');
      console.groupEnd();
      return;
    }
    
    try {
      // Test employees endpoint
      const response = await fetch(`${baseUrl}/api/employees/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Employees API working:', {
          status: response.status,
          count: data.count || 0,
          resultsLength: data.results?.length || 0
        });
      } else {
        console.error('❌ Employees API failed:', {
          status: response.status,
          statusText: response.statusText
        });
      }
    } catch (error) {
      console.error('❌ API connection failed:', error);
    }
    
    console.groupEnd();
  }
}

// Global debug functions for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).authDebug = {
    info: () => AuthDebugger.logAuthInfo(),
    clear: () => AuthDebugger.clearAllAuthData(),
    test: () => AuthDebugger.testApiConnection(),
    get: () => AuthDebugger.getAuthInfo()
  };
  
  console.log('🔧 Auth debug utilities available:');
  console.log('- authDebug.info() - Show auth info');
  console.log('- authDebug.clear() - Clear auth data');
  console.log('- authDebug.test() - Test API connection');
  console.log('- authDebug.get() - Get auth info object');
}