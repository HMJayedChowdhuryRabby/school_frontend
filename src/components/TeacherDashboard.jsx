import React, { useState } from 'react';
// Add any other needed imports here

export default function TeacherDashboard({ teacher, students, studentsLoading, markAttendance, enterGrades }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState({});
  const [attendanceError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grades, setGrades] = useState({});
  const [gradeError] = useState('');
  const [gradesList] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesListError, setGradesListError] = useState('');

  // Fetch grades for selected class and subject
  const fetchGradesList = async () => {
    if (!selectedClass || !selectedSubject) return;
    setGradesLoading(true);
    setGradesListError('');
    try {
      // Replace with your actual API call
      // const res = await axios.get(`/grades?classId=${selectedClass}&subjectId=${selectedSubject}`);
      // setGradesList(res.data);
    } catch {
      setGradesListError('Error fetching grades');
    } finally {
      setGradesLoading(false);
    }
  };

  return (
    <div>
      {/* Attendance Section */}
      <h3 className="font-semibold mb-2">Attendance</h3>
      <div className="mb-4 flex gap-4">
        <div>
          <label className="mr-2">Select Class:</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Select --</option>
            {teacher?.classes && teacher.classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>
      {studentsLoading && <div>Loading students...</div>}
      {selectedClass && students && (
        <form
          onSubmit={e => {
            e.preventDefault();
            markAttendance();
          }}
          className="mb-4"
        >
          <table className="w-full border mb-2">
            <thead>
              <tr>
                <th className="border px-2">Student Name</th>
                <th className="border px-2">Present</th>
                <th className="border px-2">Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map(stu => (
                <tr key={stu._id}>
                  <td className="border px-2">{stu.user?.name || stu.name}</td>
                  <td className="border px-2 text-center">
                    <input
                      type="radio"
                      name={`attendance-${stu._id}`}
                      checked={attendance[stu._id] === 'Present'}
                      onChange={() => setAttendance(a => ({ ...a, [stu._id]: 'Present' }))}
                    />
                  </td>
                  <td className="border px-2 text-center">
                    <input
                      type="radio"
                      name={`attendance-${stu._id}`}
                      checked={attendance[stu._id] === 'Absent'}
                      onChange={() => setAttendance(a => ({ ...a, [stu._id]: 'Absent' }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Mark Attendance</button>
          {attendanceError && <div className="text-red-600 mt-2">{attendanceError}</div>}
        </form>
      )}

      {/* Grade Entry Section */}
      <div>
        <h3 className="font-semibold mb-2">Grade Entry</h3>
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Select --</option>
              {teacher?.classes && teacher.classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Select --</option>
              {teacher?.subjects && teacher.subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>
        {selectedClass && selectedSubject && students && (
          <form
            onSubmit={e => {
              e.preventDefault();
              enterGrades();
            }}
            className="mb-4"
          >
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th className="border px-2">Student Name</th>
                  <th className="border px-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr key={stu._id}>
                    <td className="border px-2">{stu.user?.name || stu.name}</td>
                    <td className="border px-2">
                      <input
                        type="text"
                        value={grades[stu._id] || ''}
                        onChange={e => setGrades(g => ({ ...g, [stu._id]: e.target.value }))}
                        className="border p-1 rounded w-24"
                        placeholder="Grade"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Enter Grades</button>
            {gradeError && <div className="text-red-600 mt-2">{gradeError}</div>}
          </form>
        )}
      </div>

      {/* View Grades Section */}
      <div>
        <h3 className="font-semibold mb-2">View Grades</h3>
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Select --</option>
              {teacher?.classes && teacher.classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Select --</option>
              {teacher?.subjects && teacher.subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={fetchGradesList}
            disabled={!selectedClass || !selectedSubject}
          >View Grades</button>
        </div>
        {gradesLoading && <div>Loading grades...</div>}
        {gradesListError && <div className="text-red-600 mb-2">{gradesListError}</div>}
        {gradesList && gradesList.length > 0 && (
          <table className="w-full border mb-2">
            <thead>
              <tr>
                <th className="border px-2">Student Name</th>
                <th className="border px-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {gradesList.map(record => (
                <tr key={record.student._id}>
                  <td className="border px-2">{record.student.user?.name || record.student.name}</td>
                  <td className="border px-2">{record.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
