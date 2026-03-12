export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream p-4 md:p-12">
      {children}
    </div>
  );
}
