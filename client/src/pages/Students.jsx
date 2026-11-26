import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

export default function Students() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page')) || 1;
  const search = params.get('search') || '';

  const [input, setInput] = useState(search);
  const [data, setData] = useState({ students: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce the search box so we do not call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== search) setParams(input ? { search: input } : {});
    }, 400);
    return () => clearTimeout(t);
  }, [input]); // eslint-disable-line

  const load = () => {
    setLoading(true);
    api
      .get('/students', { params: { page, search, limit: 8 } })
      .then((res) => {
        setData(res.data);
        setError('');
      })
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, search]); // eslint-disable-line

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/students/${s._id}`);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const goTo = (p) => setParams({ ...(search ? { search } : {}), page: p });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Students</h1>
          <p className="muted">{data.total} record(s) found</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      <div className="search-bar">
        <input placeholder="Search by name, email, roll no or course..." value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        {loading ? (
          <Loader text="Loading students..." />
        ) : data.students.length === 0 ? (
          <p className="muted center">No students found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Email</th><th>Course</th><th>Sem</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.rollNumber}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>{s.semester}</td>
                    <td className="actions">
                      <Link className="btn btn-sm btn-info" to={`/students/${s._id}`}>View</Link>
                      <Link className="btn btn-sm btn-warn" to={`/students/${s._id}/edit`}>Edit</Link>
                      {isAdmin && <button className="btn btn-sm btn-danger" onClick={() => remove(s)}>Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={data.page || page} pages={data.pages} onChange={goTo} />
      </div>
    </>
  );
}
