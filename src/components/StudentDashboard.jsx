import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios';

export default function StudentDashboard() {
  const studentId = localStorage.getItem('userId');
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const res = await axios.get(`/students/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  // Attendance
  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', studentId],
    queryFn: async () => {
      const res = await axios.get(`/attendance/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  // Grades
  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ['grades', studentId],
    queryFn: async () => {
      const res = await axios.get(`/grades/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  // Fees
  const { data: fees, isLoading: feesLoading } = useQuery({
    queryKey: ['fees', studentId],
    queryFn: async () => {
      const res = await axios.get(`/fees/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Student Dashboard</h2>
      {isLoading && <div>Loading student info...</div>}
      {error && <div className="text-red-600">Error loading student info</div>}
      {student && (
        <>
          <h3 className="font-semibold mb-2">Classes</h3>
          <ul className="list-disc ml-6 mb-4">
            {student.class ? <li>{student.class.name}</li> : <li>No class assigned</li>}
          </ul>

          <h3 className="font-semibold mb-2">Attendance</h3>
          {attendanceLoading && <div>Loading attendance...</div>}
          {attendance && attendance.length > 0 ? (
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th className="border px-2">Date</th>
                  <th className="border px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(rec => (
                  <tr key={rec._id}>
                    <td className="border px-2">{rec.date}</td>
                    <td className="border px-2">{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div>No attendance records</div>}

          <h3 className="font-semibold mb-2">Grades</h3>
          {gradesLoading && <div>Loading grades...</div>}
          {grades && grades.length > 0 ? (
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th className="border px-2">Subject</th>
                  <th className="border px-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(rec => (
                  <tr key={rec._id}>
                    <td className="border px-2">{rec.subject?.name || '-'}</td>
                    <td className="border px-2">{rec.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div>No grades available</div>}

          <h3 className="font-semibold mb-2">Fees</h3>
          {feesLoading && <div>Loading fees...</div>}
          {fees && fees.length > 0 ? (
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th className="border px-2">Type</th>
                  <th className="border px-2">Amount</th>
                  <th className="border px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee._id}>
                    <td className="border px-2">{fee.type}</td>
                    <td className="border px-2">{fee.amount}</td>
                    <td className="border px-2">{fee.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div>No fee records</div>}
        </>
      )}
    </div>
  );
}
