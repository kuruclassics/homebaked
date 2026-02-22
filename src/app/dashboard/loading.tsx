export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-9 w-48 bg-cream-dark rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-cream-dark rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-cream-dark rounded-xl" />
    </div>
  );
}
