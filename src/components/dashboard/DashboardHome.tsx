
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Pending Evaluations',
      value: '23',
      change: '-5%',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Completed This Month',
      value: '156',
      change: '+18%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Average Score',
      value: '8.4',
      change: '+0.2',
      icon: Award,
      color: 'purple'
    }
  ];

  const recentActivity = [
    { name: 'Alice Johnson', action: 'completed evaluation', time: '2 hours ago', type: 'evaluation' },
    { name: 'Bob Smith', action: 'updated profile', time: '4 hours ago', type: 'profile' },
    { name: 'Carol Davis', action: 'submitted objectives', time: '1 day ago', type: 'objectives' },
    { name: 'David Wilson', action: 'scheduled review', time: '2 days ago', type: 'review' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">
          {user?.role === 'admin' && 'System administration and analytics'}
          {user?.role === 'hr' && 'HR metrics and employee management'}
          {user?.role === 'manager' && 'Team performance and evaluations'}
          {user?.role === 'employee' && 'Your performance and goals'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${stat.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.name}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Evaluation scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
