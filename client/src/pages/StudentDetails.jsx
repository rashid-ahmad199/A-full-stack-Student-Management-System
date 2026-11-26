import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setS(res.data))
      .catch((err) => setError(getError(err)));
  }, [id]);

  const remove = async () => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/students/${id}`);
      navigate('/students');
    } catch (err) {
      setError(getError(err));
    }
  };

  if (error) return <div className="alert">{error}</div>;
  if (!s) return <Loader text="Loading student..." />;

  const rows = [
    ['Roll Number', s.rollNumber],
    ['Email', s.email],
    ['Phone', s.phone],
    ['Course', s.course],
    ['Semester', s.semester],
    ['Gender', s.gender],
    ['Address', s.address || '—'],
    ['Registered On', new Date(s.createdAt).toLocaleString()],
    ['Added By', s.createdBy?.name || '—'],
  ];

  return (
    <>
      <div className="page-head">
        <h1>Student Details</h1>
        <div className="actions">
          <Link to="/students" className="btn btn-light">← Back</Link>
          <Link to={`/students/${id}/edit`} className="btn btn-warn">Edit</Link>
          {isAdmin && <button className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </div>
      <div className="card details">
        <div className="avatar">{s.name.charAt(0).toUpperCase()}</div>
        <h2>{s.name}</h2>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </>
  );
}
