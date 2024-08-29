import React from 'react';

const WeeklyAttendanceHistory = ({ attendanceHistory }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Weekly Attendance History</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceHistory.map((attendance, index) => (
            <tr key={index}>
              <td>{attendance.check_in_date}</td>
              <td>{attendance.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyAttendanceHistory;
