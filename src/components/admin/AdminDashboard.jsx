import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeList from './EmployeeList';
import AddEmployeeForm from './AddEmployeeForm';
import AttendanceMap from './AttendanceMap';
import AttendanceList from './AttendanceList';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Rahul Gandhi',
      email: 'rahul@parliament.gov.in',
      assignedShop: { name: 'Wayanad', lat: 11.6854, lng: 76.1320 },
      status: 'Present',
      checkInTime: '09:15 AM',
      checkInLocation: { lat: 11.6855, lng: 76.1321 },
      constituency: 'Wayanad'
    },
    {
      id: '2',
      name: 'Narendra Modi',
      email: 'modi@parliament.gov.in',
      assignedShop: { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      status: 'Present',
      checkInTime: '09:00 AM',
      checkInLocation: { lat: 25.3177, lng: 82.9740 },
      constituency: 'Varanasi'
    },
    {
      id: '3',
      name: 'Mamata Banerjee',
      email: 'mamata@parliament.gov.in',
      assignedShop: { name: 'West Bengal', lat: 22.9868, lng: 87.8550 },
      status: 'Absent',
      checkInTime: null,
      checkInLocation: null,
      constituency: 'West Bengal'
    },
    {
      id: '4',
      name: 'Arvind Kejriwal',
      email: 'kejriwal@parliament.gov.in',
      assignedShop: { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
      status: 'Late',
      checkInTime: '10:30 AM',
      checkInLocation: { lat: 28.6140, lng: 77.2091 },
      constituency: 'Delhi'
    },
    {
      id: '5',
      name: 'Yogi Adityanath',
      email: 'yogi@parliament.gov.in',
      assignedShop: { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      status: 'Present',
      checkInTime: '09:20 AM',
      checkInLocation: { lat: 26.8468, lng: 80.9463 },
      constituency: 'Uttar Pradesh'
    }
  ]);

  const shops = [
    { id: '1', name: 'Parliament House', lat: 28.6139, lng: 77.2090 },
    { id: '2', name: 'Varanasi Constituency Office', lat: 25.3176, lng: 82.9739 },
    { id: '3', name: 'Wayanad Constituency Office', lat: 11.6854, lng: 76.1320 }
  ];

  const addEmployee = (employee) => {
    setEmployees([...employees, { ...employee, id: Date.now().toString() }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Employee Attendance Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={onLogout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button 
            variant={activeTab === 'employees' ? 'default' : 'outline'}
            onClick={() => setActiveTab('employees')}
          >
            Employee List
          </Button>
          <Button 
            variant={activeTab === 'attendance-list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('attendance-list')}
          >
            Attendance List
          </Button>
          <Button 
            variant={activeTab === 'add' ? 'default' : 'outline'}
            onClick={() => setActiveTab('add')}
          >
            Add Employee
          </Button>
          <Button 
            variant={activeTab === 'map' ? 'default' : 'outline'}
            onClick={() => setActiveTab('map')}
          >
            India Map
          </Button>
        </div>

        {activeTab === 'employees' && (
          <EmployeeList employees={employees} />
        )}

        {activeTab === 'attendance-list' && (
          <AttendanceList employees={employees} />
        )}

        {activeTab === 'add' && (
          <AddEmployeeForm shops={shops} onAddEmployee={addEmployee} />
        )}

        {activeTab === 'map' && (
          <div key="attendance-map">
            <AttendanceMap employees={employees} shops={shops} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
