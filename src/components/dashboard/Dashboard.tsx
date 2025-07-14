
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import EmployeeList from '../employees/EmployeeList';
import EvaluationList from '../evaluations/EvaluationList';
import DepartmentList from '../departments/DepartmentList';
import AdminTools from '../admin/AdminTools';
import DashboardHome from './DashboardHome';

type ActiveView = 'dashboard' | 'employees' | 'evaluations' | 'departments' | 'admin';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view as ActiveView);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'employees':
        return <EmployeeList />;
      case 'evaluations':
        return <EvaluationList />;
      case 'departments':
        return <DepartmentList />;
      case 'admin':
        return <AdminTools />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
