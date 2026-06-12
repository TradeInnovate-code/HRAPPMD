import { AppShell } from '@/components/layout/app-shell';

export default function RaciLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
