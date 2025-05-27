
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const EmployeeAttendanceView = ({ user, attendanceHistory = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Out of Range': return 'bg-yellow-100 text-yellow-800';
      case 'Late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock attendance history for demo
  const mockHistory = [
    { date: '2024-05-27', status: 'Present', checkInTime: '09:15 AM', checkOutTime: '05:30 PM' },
    { date: '2024-05-26', status: 'Present', checkInTime: '09:10 AM', checkOutTime: '05:25 PM' },
    { date: '2024-05-25', status: 'Late', checkInTime: '09:45 AM', checkOutTime: '05:30 PM' },
    { date: '2024-05-24', status: 'Present', checkInTime: '09:05 AM', checkOutTime: '05:35 PM' },
    { date: '2024-05-23', status: 'Absent', checkInTime: null, checkOutTime: null },
    { date: '2024-05-22', status: 'Present', checkInTime: '09:20 AM', checkOutTime: '05:40 PM' },
    { date: '2024-05-21', status: 'Out of Range', checkInTime: '09:30 AM', checkOutTime: '05:20 PM' }
  ];

  const history = attendanceHistory.length > 0 ? attendanceHistory : mockHistory;

  // Calculate statistics
  const totalDays = history.length;
  const presentDays = history.filter(day => day.status === 'Present').length;
  const absentDays = history.filter(day => day.status === 'Absent').length;
  const lateDays = history.filter(day => day.status === 'Late').length;
  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            My Profile & Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{presentDays}</div>
              <div className="text-sm text-gray-600">Present Days</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{absentDays}</div>
              <div className="text-sm text-gray-600">Absent Days</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{lateDays}</div>
              <div className="text-sm text-gray-600">Late Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Attendance History (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900 min-w-[100px]">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <Badge className={getStatusColor(day.status)}>
                    {day.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {day.checkInTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>In: {day.checkInTime}</span>
                    </div>
                  )}
                  {day.checkOutTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Out: {day.checkOutTime}</span>
                    </div>
                  )}
                  {!day.checkInTime && day.status === 'Absent' && (
                    <span className="text-red-500">No attendance recorded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Current Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Constituency</p>
              <p className="text-lg">{user.assignedShop?.name || 'Not Assigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <p className="text-lg">Member of Parliament</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Session</p>
              <p className="text-lg">Current Parliamentary Session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendanceView;
