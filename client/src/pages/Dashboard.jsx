import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/students/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(getError(err)));
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/students?search=${encodeURIComponent(search.trim())}`);
  };

  if (error) return <div className="alert">{error}</div>;
  if (!stats) return <Loader text="Loading dashboard..." />;

  const max = Math.max(...stats.byCourse.map((c) => c.count), 1);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, {user.name}</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      <form className="search-bar" onSubmit={onSearch}>
        <input placeholder="Search students by name, email, roll no or course..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary">Search</button>
      </form>

      <div className="stats-grid">
        <div className="stat-card blue"><span>Total Students</span><strong>{stats.total}</strong></div>
        <div className="stat-card green"><span>New This Week</span><strong>{stats.thisWeek}</strong></div>
        <div className="stat-card orange"><span>Total Courses</span><strong>{stats.totalCourses}</strong></div>
        {isAdmin && <div className="stat-card purple"><span>System Users</span><strong>{stats.totalUsers}</strong></div>}
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Recent Registrations</h3>
          {stats.recent.length === 0 ? (
            <p className="muted">No students yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Roll No</th><th>Course</th><th>Added</th></tr>
                </thead>
                <tbody>
                  {stats.recent.map((s) => (
                    <tr key={s._id}>
                      <td><Link to={`/students/${s._id}`}>{s.name}</Link></td>
                      <td>{s.rollNumber}</td>
                      <td>{s.course}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Students by Course</h3>
          {stats.byCourse.length === 0 && <p className="muted">No data yet.</p>}
          {stats.byCourse.map((c) => (
            <div key={c.course} className="bar-row">
              <div className="bar-label"><span>{c.course}</span><span>{c.count}</span></div>
              <div className="bar"><div style={{ width: `${(c.count / max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
