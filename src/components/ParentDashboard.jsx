import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios';

function ParentStudentAttendance({ studentId }) {
  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', studentId],
    queryFn: async () => {
      const res = await axios.get(`/attendance/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-1">Attendance</h4>
      {isLoading && <div>Loading attendance...</div>}
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
    </div>
  );
}

function ParentStudentGrades({ studentId }) {
  const { data: grades, isLoading } = useQuery({
    queryKey: ['grades', studentId],
    queryFn: async () => {
      const res = await axios.get(`/grades/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-1">Grades</h4>
      {isLoading && <div>Loading grades...</div>}
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
    </div>
  );
}

function ParentStudentFees({ studentId }) {
  const { data: fees, isLoading } = useQuery({
    queryKey: ['fees', studentId],
    queryFn: async () => {
      const res = await axios.get(`/fees/student/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-1">Fees</h4>
      {isLoading && <div>Loading fees...</div>}
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
    </div>
  );
}

export default function ParentDashboard() {
  const parentId = localStorage.getItem('userId');
  const { data: parent, isLoading, error } = useQuery({
    queryKey: ['parent', parentId],
    queryFn: async () => {
      const res = await axios.get(`/parents/${parentId}`);
      return res.data;
    },
    enabled: !!parentId,
  });

  // Assume parent.students is an array of children
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Parent Dashboard</h2>
      {isLoading && <div>Loading parent info...</div>}
      {error && <div className="text-red-600">Error loading parent info</div>}
      {parent && parent.students && parent.students.length > 0 ? (
        parent.students.map(student => (
          <div key={student._id} className="mb-8">
            <h3 className="font-semibold mb-2">Student: {student.user?.name || student.name}</h3>
            <div className="mb-2">Class: {student.class?.name || '-'}</div>

            {/* Attendance */}
            <ParentStudentAttendance studentId={student._id} />
            {/* Grades */}
            <ParentStudentGrades studentId={student._id} />
            {/* Fees */}
            <ParentStudentFees studentId={student._id} />
          </div>
        ))
      ) : <div>No student info available</div>}
    </div>
  );
}
