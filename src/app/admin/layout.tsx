'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <AdminNav />
        {children}
      </div>
    </QueryClientProvider>
  );
}