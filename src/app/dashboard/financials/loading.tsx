export default function FinancialsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-9 w-40 bg-cream-dark rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-cream-dark rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-48 bg-cream-dark rounded-xl" />
        <div className="h-48 bg-cream-dark rounded-xl" />
      </div>
    </div>
  );
}
