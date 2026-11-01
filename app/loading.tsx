export default function Loading() {
  return (
    <div className="page-loader" aria-label="Loading page">
      <div className="aperture-spinner" />
      <p className="text-sm font-medium text-ink-2">Focusing the lights…</p>
    </div>
  );
}
