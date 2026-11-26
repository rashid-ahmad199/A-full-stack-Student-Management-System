export default function Loader({ full = false, text = 'Loading...' }) {
  return (
    <div className={full ? 'loader-wrap full' : 'loader-wrap'}>
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
