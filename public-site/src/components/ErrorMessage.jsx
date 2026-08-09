export default function ErrorMessage({ message }) {
  return <p className="status error">Something went wrong: {message}</p>;
}