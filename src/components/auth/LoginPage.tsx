
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Users, Shield, BarChart3, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@company.com', icon: Shield },
    { role: 'HR Manager', email: 'hr@company.com', icon: Users },
    { role: 'Department Manager', email: 'manager@company.com', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <img 
                src="/logo.png" 
                alt="Company Logo" 
                className="h-10 w-auto"
              />
              <h1 className="text-3xl font-bold text-gray-900">HR System</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-lg">
              Streamline your employee evaluation process with our comprehensive management platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Employee Management</h3>
              <p className="text-sm text-gray-600">Manage employee data and profiles</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <BarChart3 className="h-6 w-6 text-teal-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Performance Tracking</h3>
              <p className="text-sm text-gray-600">Track evaluations and objectives</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <Shield className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Role-based Access</h3>
              <p className="text-sm text-gray-600">Secure, permission-based system</p>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-3">Demo Credentials:</h4>
            <div className="space-y-2">
              {demoCredentials.map((cred) => {
                const Icon = cred.icon;
                return (
                  <div key={cred.email} className="flex items-center space-x-2 text-sm">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{cred.role}:</span>
                    <span className="text-blue-700">{cred.email}</span>
                  </div>
                );
              })}
              <p className="text-xs text-blue-600 mt-2">Password: password</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
