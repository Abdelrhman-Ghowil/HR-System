
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EmployeeHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
        <p className="text-gray-600">Manage employee profiles and information</p>
      </div>
      <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </Button>
    </div>
  );
};

export default EmployeeHeader;
