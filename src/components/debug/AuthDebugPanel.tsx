import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AuthDebugger, AuthDebugInfo } from '../../utils/authDebug';
import { useAuth } from '../../hooks/useAuth';
import { RefreshCw, Trash2, TestTube, Info } from 'lucide-react';
import { toast } from 'sonner';

export const AuthDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const refreshDebugInfo = () => {
    const info = AuthDebugger.getAuthInfo();
    setDebugInfo(info);
    AuthDebugger.logAuthInfo();
  };

  const clearAuthData = () => {
    AuthDebugger.clearAllAuthData();
    logout();
    refreshDebugInfo();
    toast.success('Authentication data cleared');
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      await AuthDebugger.testApiConnection();
      toast.success('API connection test completed - check console for details');
    } catch (error) {
      toast.error('API connection test failed');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    refreshDebugInfo();
  }, [user, isAuthenticated]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Authentication Debug Panel
        </CardTitle>
        <CardDescription>
          Debug authentication state and token storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Auth State */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Current Authentication State</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">User Status</div>
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">User Info</div>
              <div className="text-sm text-gray-600">
                {user ? `${user.name} (${user.role})` : 'No user data'}
              </div>
            </div>
          </div>
        </div>

        {/* Token Information */}
        {debugInfo && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Token Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Token Status</div>
                <Badge variant={debugInfo.hasToken ? 'default' : 'destructive'}>
                  {debugInfo.hasToken ? 'Present' : 'Missing'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Token Validity</div>
                <Badge variant={debugInfo.isTokenValid ? 'default' : 'destructive'}>
                  {debugInfo.isTokenValid ? 'Valid' : 'Invalid/Expired'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Token Length</div>
                <div className="text-sm text-gray-600">{debugInfo.tokenLength} characters</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Expiry</div>
                <div className="text-sm text-gray-600">
                  {debugInfo.tokenExpiry ? debugInfo.tokenExpiry.toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Configuration */}
        {debugInfo && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">API Configuration</h3>
            <div className="space-y-2">
              <div className="text-sm font-medium">Base URL</div>
              <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                {debugInfo.apiBaseUrl}
              </div>
            </div>
          </div>
        )}

        {/* Storage Information */}
        {debugInfo && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Local Storage</h3>
            <div className="space-y-2">
              <div className="text-sm font-medium">Auth-related Keys</div>
              <div className="flex flex-wrap gap-2">
                {debugInfo.localStorageKeys
                  .filter(key => key.includes('auth') || key.includes('token') || key.includes('user'))
                  .map(key => (
                    <Badge key={key} variant="outline">
                      {key}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Debug Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Debug Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={refreshDebugInfo} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Info
            </Button>
            <Button 
              onClick={testApiConnection} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isLoading ? 'Testing...' : 'Test API'}
            </Button>
            <Button onClick={clearAuthData} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Auth Data
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Troubleshooting</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>If employees are not loading:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Check if you're authenticated (green badges above)</li>
              <li>Verify the token is valid and not expired</li>
              <li>Test API connection using the "Test API" button</li>
              <li>Check browser console for detailed error messages</li>
              <li>If token is expired, try logging out and logging back in</li>
            </ul>
            <p className="mt-3"><strong>Console Commands:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code className="bg-gray-100 px-1 rounded">authDebug.info()</code> - Show detailed auth info</li>
              <li><code className="bg-gray-100 px-1 rounded">authDebug.test()</code> - Test API connection</li>
              <li><code className="bg-gray-100 px-1 rounded">authDebug.clear()</code> - Clear auth data</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;