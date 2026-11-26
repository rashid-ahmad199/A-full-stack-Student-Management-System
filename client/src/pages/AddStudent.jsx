import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getError } from '../api/axios';
import StudentForm from '../components/StudentForm';

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/students', values);
      navigate('/students');
    } catch (err) {
      setError(getError(err));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-head"><h1>Add Student</h1></div>
      {error && <div className="alert">{error}</div>}
      <StudentForm onSubmit={submit} submitLabel="Add Student" loading={loading} />
    </>
  );
}
