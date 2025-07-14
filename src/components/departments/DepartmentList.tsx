
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, Plus } from 'lucide-react';

const DepartmentList = () => {
  const departments = [
    { id: '1', name: 'Engineering', employeeCount: 45, manager: 'Sarah Johnson' },
    { id: '2', name: 'Human Resources', employeeCount: 8, manager: 'Michael Chen' },
    { id: '3', name: 'Sales', employeeCount: 32, manager: 'Emily Rodriguez' },
    { id: '4', name: 'Marketing', employeeCount: 15, manager: 'David Kim' },
    { id: '5', name: 'Finance', employeeCount: 12, manager: 'Lisa Wang' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-600">Manage organizational departments</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Building className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>{department.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {department.employeeCount} employees
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Manager</p>
                <p className="font-medium text-gray-900">{department.manager}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;
