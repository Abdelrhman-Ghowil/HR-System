
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  departments: string[];
}

const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  departments
}: EmployeeFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept === 'all' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default EmployeeFilters;
