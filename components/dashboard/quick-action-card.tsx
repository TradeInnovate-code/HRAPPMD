import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, FileText, Grid3X3, ArrowRight } from 'lucide-react';

const actions = [
  {
    label: 'Run Audit',
    href: '/audit',
    icon: ClipboardCheck,
    description: 'Assess your organization',
  },
  {
    label: 'Generate JD',
    href: '/job-descriptions',
    icon: FileText,
    description: 'Create job descriptions',
  },
  {
    label: 'Build RACI',
    href: '/raci',
    icon: Grid3X3,
    description: 'Map responsibilities',
  },
];

export function QuickActionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
