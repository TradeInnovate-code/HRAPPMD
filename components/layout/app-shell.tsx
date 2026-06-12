'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className={cn('flex-1 overflow-y-auto p-6 lg:p-8 transition-all duration-300')}>
          {children}
        </main>
      </div>
    </div>
  );
}
