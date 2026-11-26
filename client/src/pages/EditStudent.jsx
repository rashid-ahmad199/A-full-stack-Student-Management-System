import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getError } from '../api/axios';
import StudentForm from '../components/StudentForm';
import Loader from '../components/Loader';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => setError(getError(err)));
  }, [id]);

  const submit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/students/${id}`, values);
      navigate(`/students/${id}`);
    } catch (err) {
      setError(getError(err));
      setLoading(false);
    }
  };

  if (!student && !error) return <Loader text="Loading student..." />;

  return (
    <>
      <div className="page-head"><h1>Edit Student</h1></div>
      {error && <div className="alert">{error}</div>}
      {student && <StudentForm initial={student} onSubmit={submit} submitLabel="Save Changes" loading={loading} />}
    </>
  );
}
