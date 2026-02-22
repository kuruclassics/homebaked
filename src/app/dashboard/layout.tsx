import Sidebar from '@/components/dashboard/Sidebar';

export const metadata = {
  title: 'Dashboard — HomeBaked',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:ml-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
