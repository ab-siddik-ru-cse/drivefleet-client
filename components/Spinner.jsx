export default function Spinner({ size = 40 }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className="animate-spin rounded-full border-4 border-gray-200 border-t-brand-600 dark:border-gray-700 dark:border-t-brand-500"
        style={{ width: size, height: size }}
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
