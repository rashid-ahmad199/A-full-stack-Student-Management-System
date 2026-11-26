import { useState } from 'react';

const empty = { name: '', email: '', rollNumber: '', phone: '', course: '', semester: 1, gender: 'Male', address: '' };

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address';
  if (!v.rollNumber.trim()) e.rollNumber = 'Roll number is required';
  if (!/^[0-9+\-\s]{7,15}$/.test(v.phone)) e.phone = 'Enter a valid phone number (7-15 digits)';
  if (!v.course.trim()) e.course = 'Course is required';
  const sem = Number(v.semester);
  if (!sem || sem < 1 || sem > 12) e.semester = 'Semester must be between 1 and 12';
  return e;
};

export default function StudentForm({ initial, onSubmit, submitLabel, loading }) {
  const [values, setValues] = useState({ ...empty, ...initial });
  const [errors, setErrors] = useState({});

  const handle = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit({ ...values, semester: Number(values.semester) });
  };

  const field = (name, label, type = 'text', props = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={values[name]} onChange={handle} className={errors[name] ? 'invalid' : ''} {...props} />
      {errors[name] && <small className="error-text">{errors[name]}</small>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="card form-grid">
      {field('name', 'Full Name')}
      {field('email', 'Email', 'email')}
      {field('rollNumber', 'Roll Number')}
      {field('phone', 'Phone')}
      {field('course', 'Course')}
      {field('semester', 'Semester', 'number', { min: 1, max: 12 })}
      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" value={values.gender} onChange={handle}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group full">
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" rows="3" value={values.address} onChange={handle} />
      </div>
      <div className="full">
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
