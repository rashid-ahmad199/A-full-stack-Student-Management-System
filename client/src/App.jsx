import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentDetails from './pages/StudentDetails';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container">{children}</main>
    </>
  );
}

const page = (el) => (
  <ProtectedRoute>
    <Layout>{el}</Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={page(<Dashboard />)} />
      <Route path="/students" element={page(<Students />)} />
      <Route path="/students/add" element={page(<AddStudent />)} />
      <Route path="/students/:id" element={page(<StudentDetails />)} />
      <Route path="/students/:id/edit" element={page(<EditStudent />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
