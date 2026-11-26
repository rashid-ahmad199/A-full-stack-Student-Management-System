import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../api/axios';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setServerError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const input = (k, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={k}>{label}</label>
      <input id={k} type={type} value={form[k]} onChange={set(k)} className={errors[k] ? 'invalid' : ''} />
      {errors[k] && <small className="error-text">{errors[k]}</small>}
    </div>
  );

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h2>Create account</h2>
        <p className="muted">Register to get started</p>
        {serverError && <div className="alert">{serverError}</div>}
        {input('name', 'Full Name')}
        {input('email', 'Email', 'email')}
        {input('password', 'Password', 'password')}
        {input('confirm', 'Confirm Password', 'password')}
        <button className="btn btn-primary block" disabled={loading}>
          {loading ? <><span className="btn-spinner" /> Creating...</> : 'Register'}
        </button>
        <p className="muted center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
