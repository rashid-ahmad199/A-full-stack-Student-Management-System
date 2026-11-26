import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">🎓 StudentMS</div>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/students" end>Students</NavLink>
          <NavLink to="/students/add">Add Student</NavLink>
          <span className="nav-user">
            {user.name} <span className={`badge ${user.role}`}>{user.role}</span>
          </span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}
