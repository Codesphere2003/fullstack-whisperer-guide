
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AttendanceList = ({ employees }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Out of Range': return 'bg-yellow-100 text-yellow-800';
      case 'Late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmployees = employees.filter(employee => 
    filterStatus === 'all' || employee.status === filterStatus
  );

  const statusCounts = {
    total: employees.length,
    present: employees.filter(emp => emp.status === 'Present').length,
    absent: employees.filter(emp => emp.status === 'Absent').length,
    late: employees.filter(emp => emp.status === 'Late').length,
    outOfRange: employees.filter(emp => emp.status === 'Out of Range').length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total MPs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.late}</div>
            <div className="text-sm text-gray-600">Late</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.outOfRange}</div>
            <div className="text-sm text-gray-600">Out of Range</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>MP Attendance List</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === 'Present' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('Present')}
            >
              Present
            </Button>
            <Button 
              variant={filterStatus === 'Absent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('Absent')}
            >
              Absent
            </Button>
            <Button 
              variant={filterStatus === 'Late' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('Late')}
            >
              Late
            </Button>
            <Button 
              variant={filterStatus === 'Out of Range' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('Out of Range')}
            >
              Out of Range
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Constituency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.assignedShop?.name || 'Not Assigned'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.checkInTime || 'No check-in'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found with the selected status.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceList;
