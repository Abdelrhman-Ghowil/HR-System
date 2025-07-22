
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Edit, Mail, Phone, X, Search, Filter } from 'lucide-react';
import EmployeeDetails from './EmployeeDetails';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
  avatar: string;
  department: string;
  position: string;
  role: 'Admin' | 'HR' | 'HOD' | 'LM' | 'Employee';
  managerialWeight: 'Supervisory' | 'Middle Management' | 'IC';
  status: 'active' | 'inactive';
  companyName: string;
  joinDate: string;
}

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    avatar: '',
    department: '',
    position: '',
    role: 'Employee' as const,
    managerialWeight: 'IC' as const,
    status: 'active' as const,
    companyName: 'Squad',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Initialize employees data
  useEffect(() => {
    setEmployees(initialEmployees);
  }, []);

  const initialEmployees: Employee[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '(555) 123-4567',
      avatar: '/placeholder.svg',
      department: 'Engineering',
      position: 'Senior Developer',
      role: 'Employee',
      managerialWeight: 'IC',
      status: 'active',
      companyName: 'Squad',
      joinDate: '2022-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '(555) 234-5678',
      avatar: '/placeholder.svg',
      department: 'Human Resources',
      position: 'HR Manager',
      role: 'HR',
      managerialWeight: 'Middle Management',
      status: 'active',
      companyName: 'Squad',
      joinDate: '2021-03-10'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '(555) 345-6789',
      avatar: '/placeholder.svg',
      department: 'Sales',
      position: 'Sales Manager',
      role: 'LM',
      managerialWeight: 'Supervisory',
      status: 'active',
      companyName: 'Squad',
      joinDate: '2020-07-22'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '(555) 456-7890',
      avatar: '/placeholder.svg',
      department: 'Engineering',
      position: 'Frontend Developer',
      role: 'Employee',
      managerialWeight: 'IC',
      status: 'active',
      companyName: 'Squad',
      joinDate: '2023-02-01'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      phone: '(555) 567-8901',
      avatar: '/placeholder.svg',
      department: 'Marketing',
      position: 'Marketing Specialist',
      role: 'Employee',
      managerialWeight: 'IC',
      status: 'inactive',
      companyName: 'Squad',
      joinDate: '2021-11-05'
    }
  ];

  // Handler functions
  const handleToggleStatus = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      ));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    }
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.department && newEmployee.position && newEmployee.managerialWeight) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone || '',
        countryCode: newEmployee.countryCode,
        avatar: newEmployee.avatar || '',
        department: newEmployee.department,
        position: newEmployee.position,
        role: newEmployee.role,
        managerialWeight: newEmployee.managerialWeight,
        status: 'active',
        companyName: newEmployee.companyName,
        joinDate: newEmployee.joinDate
      };
      setEmployees(prev => [...prev, employee]);
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        avatar: '',
        department: '',
        position: '',
        role: 'Employee' as const,
        managerialWeight: 'IC' as const,
        status: 'active' as const,
        companyName: 'Squad',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setIsAddModalOpen(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
  };

  const departments = ['all', 'Engineering', 'Human Resources', 'Sales', 'Marketing'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (selectedEmployee) {
    return (
      <EmployeeDetails 
        employee={selectedEmployee} 
        onBack={() => setSelectedEmployee(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage employee profiles and information</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Employee</DialogTitle>
              <p className="text-sm text-gray-600">Fill in the employee details below</p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={newEmployee.name || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="employee@company.com"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={newEmployee.countryCode || '+1'} 
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, countryCode: value }))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="+20">🇪🇬 +20</SelectItem>
                           <SelectItem value="+966">🇸🇦 +966</SelectItem>
                           <SelectItem value="+1">🇺🇸 +1</SelectItem>
                           <SelectItem value="+44">🇬🇧 +44</SelectItem>
                           <SelectItem value="+33">🇫🇷 +33</SelectItem>
                           <SelectItem value="+49">🇩🇪 +49</SelectItem>
                           <SelectItem value="+39">🇮🇹 +39</SelectItem>
                           <SelectItem value="+34">🇪🇸 +34</SelectItem>
                           <SelectItem value="+86">🇨🇳 +86</SelectItem>
                           <SelectItem value="+81">🇯🇵 +81</SelectItem>
                           <SelectItem value="+82">🇰🇷 +82</SelectItem>
                           <SelectItem value="+91">🇮🇳 +91</SelectItem>
                           <SelectItem value="+61">🇦🇺 +61</SelectItem>
                           <SelectItem value="+55">🇧🇷 +55</SelectItem>
                           <SelectItem value="+52">🇲🇽 +52</SelectItem>
                           <SelectItem value="+7">🇷🇺 +7</SelectItem>
                           <SelectItem value="+27">🇿🇦 +27</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        value={newEmployee.phone || ''}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="123-456-7890"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-sm font-medium">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={newEmployee.avatar || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
                    <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium">Position *</Label>
                    <Input
                      id="position"
                      value={newEmployee.position || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Job title"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
                    <Select 
                      value={newEmployee.role} 
                      onValueChange={(value: Employee['role']) => 
                        setNewEmployee((prev) => ({ 
                          ...prev, 
                          role: value as typeof prev.role 
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="LM">LM</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerialWeight" className="text-sm font-medium">Managerial Weight *</Label>
                    <Select 
                      value={newEmployee.managerialWeight} 
                      onValueChange={(value: typeof newEmployee.managerialWeight) => 
                        setNewEmployee(prev => ({ ...prev, managerialWeight: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select managerial weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supervisory">Supervisory</SelectItem>
                        <SelectItem value="Middle Management">Middle Management</SelectItem>
                        <SelectItem value="IC">IC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={newEmployee.companyName || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Company name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
                    <Select 
                      value={newEmployee.status} 
                      onValueChange={(value: typeof newEmployee.status) => 
                        setNewEmployee(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="default_active">Default Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="joinDate" className="text-sm font-medium">Join Date *</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newEmployee.joinDate || ''}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, joinDate: e.target.value }))}
                      className="w-full md:w-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Filters */}
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
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={employee.status === 'active'}
                    onCheckedChange={() => handleToggleStatus(employee.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <Badge 
                      variant={employee.status === 'active' ? 'default' : 'secondary'}
                      className={employee.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {employee.status}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {employee.role}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      {employee.managerialWeight}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{employee.department}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${employee.email}`}
                      className="truncate text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {employee.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`https://wa.me/${(employee.countryCode || '+1').replace('+', '')}${employee.phone?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                    >
                      {(employee.countryCode || '+1')} {employee.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
                    <span className="font-medium">{employee.companyName}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Employee</DialogTitle>
            <p className="text-sm text-gray-600">Update employee information below</p>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-6 py-4">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="edit-name"
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Enter full name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, email: e.target.value } : null)}
                      placeholder="employee@company.com"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-sm font-medium">Phone Number *</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={editingEmployee.countryCode || '+1'} 
                        onValueChange={(value) => setEditingEmployee(prev => prev ? { ...prev, countryCode: value } : null)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="+20">🇪🇬 +20</SelectItem>
                           <SelectItem value="+966">🇸🇦 +966</SelectItem>
                           <SelectItem value="+1">🇺🇸 +1</SelectItem>
                           <SelectItem value="+44">🇬🇧 +44</SelectItem>
                           <SelectItem value="+33">🇫🇷 +33</SelectItem>
                           <SelectItem value="+49">🇩🇪 +49</SelectItem>
                           <SelectItem value="+39">🇮🇹 +39</SelectItem>
                           <SelectItem value="+34">🇪🇸 +34</SelectItem>
                           <SelectItem value="+86">🇨🇳 +86</SelectItem>
                           <SelectItem value="+81">🇯🇵 +81</SelectItem>
                           <SelectItem value="+82">🇰🇷 +82</SelectItem>
                           <SelectItem value="+91">🇮🇳 +91</SelectItem>
                           <SelectItem value="+61">🇦🇺 +61</SelectItem>
                           <SelectItem value="+55">🇧🇷 +55</SelectItem>
                           <SelectItem value="+52">🇲🇽 +52</SelectItem>
                           <SelectItem value="+7">🇷🇺 +7</SelectItem>
                           <SelectItem value="+27">🇿🇦 +27</SelectItem>
                         </SelectContent>
                      </Select>
                      <Input
                        id="edit-phone"
                        value={editingEmployee.phone || ''}
                        onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        placeholder="123-456-7890"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-avatar" className="text-sm font-medium">Avatar URL</Label>
                    <Input
                      id="edit-avatar"
                      value={editingEmployee.avatar || ''}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, avatar: e.target.value } : null)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-department" className="text-sm font-medium">Department *</Label>
                    <Select 
                      value={editingEmployee.department} 
                      onValueChange={(value) => setEditingEmployee(prev => prev ? { ...prev, department: value } : null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-position" className="text-sm font-medium">Position *</Label>
                    <Input
                      id="edit-position"
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, position: e.target.value } : null)}
                      placeholder="Job title"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role" className="text-sm font-medium">Role *</Label>
                    <Select 
                      value={editingEmployee.role}
                      onValueChange={(value) => setEditingEmployee(prev => prev ? { ...prev, role: value as 'Admin' | 'HR' | 'HOD' | 'LM' | 'Employee' } : null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="LM">LM</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-managerialWeight" className="text-sm font-medium">Managerial Weight *</Label>
                    <Select 
                      value={editingEmployee.managerialWeight}
                      onValueChange={(value) => setEditingEmployee(prev => prev ? { ...prev, managerialWeight: value as 'Supervisory' | 'Middle Management' | 'IC' } : null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select managerial weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supervisory">Supervisory</SelectItem>
                        <SelectItem value="Middle Management">Middle Management</SelectItem>
                        <SelectItem value="IC">IC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-companyName" className="text-sm font-medium">Company Name *</Label>
                    <Input
                      id="edit-companyName"
                      value={editingEmployee.companyName || ''}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                      placeholder="Company name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-sm font-medium">Status *</Label>
                    <Select 
                      value={editingEmployee.status}
                      onValueChange={(value) => setEditingEmployee(prev => prev ? { ...prev, status: value as 'active' | 'inactive'} : null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="default_active">Default Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-joinDate" className="text-sm font-medium">Join Date *</Label>
                    <Input
                      id="edit-joinDate"
                      type="date"
                      value={editingEmployee.joinDate || ''}
                      onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, joinDate: e.target.value } : null)}
                      className="w-full md:w-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new employee.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeList;
