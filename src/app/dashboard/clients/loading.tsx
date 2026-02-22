export default function ClientsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-9 w-32 bg-cream-dark rounded-xl" />
        <div className="h-10 w-32 bg-cream-dark rounded-xl" />
      </div>
      <div className="h-10 w-64 bg-cream-dark rounded-xl" />
      <div className="h-64 bg-cream-dark rounded-xl" />
    </div>
  );
}
