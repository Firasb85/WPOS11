import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Header } from '../layout/Header';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}