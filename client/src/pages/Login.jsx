import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h2>Welcome back 👋</h2>
        <p className="muted">Login to manage students</p>
        {serverError && <div className="alert">{serverError}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} className={errors.email ? 'invalid' : ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} className={errors.password ? 'invalid' : ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </div>
        <button className="btn btn-primary block" disabled={loading}>
          {loading ? <><span className="btn-spinner" /> Logging in...</> : 'Login'}
        </button>
        <p className="muted center">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
