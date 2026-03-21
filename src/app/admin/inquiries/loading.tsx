export default function InquiriesManagementLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex gap-4">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-100 px-4 py-4">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
            <div className="ml-auto h-8 w-20 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
