import Sidebar from '@/components/dashboard/Sidebar';

export const metadata = {
  title: 'Dashboard — HomeBaked',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex print:block print:bg-white">
      <div className="print-hide">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:ml-0 min-h-screen print:p-0 print:m-0 print:min-h-0 print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
