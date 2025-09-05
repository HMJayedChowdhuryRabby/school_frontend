import './App.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './components/Login';
import RoleHome from './components/RoleHome';
import HomePage from './HomePage';
import StudentList from './components/StudentList';
import TeacherListPage from './components/TeacherListPage';

// ...existing code...



function Unauthorized() {
  return <div className="p-8 text-red-600">Unauthorized Access</div>;
}

export default function App() {
  // ...existing code...
  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  <Route path="/students" element={<StudentList />} />
  <Route path="/teachers" element={<TeacherListPage />} />
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin" element={<RoleHome role="Admin" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
        <Route path="/teacher" element={<RoleHome role="Teacher" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
        <Route path="/student" element={<RoleHome role="Student" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
        <Route path="/parent" element={<RoleHome role="Parent" />} />
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
