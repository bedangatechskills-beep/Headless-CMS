// The message matters: on free hosting the API sleeps when idle and takes
// up to a minute to wake — an honest loading state is the UX workaround.
export default function Loading() {
  return <p className="status">Loading… (first visit may take up to a minute while the server wakes up)</p>;
}