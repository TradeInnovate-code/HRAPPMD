import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, ArrowRight, Plus } from 'lucide-react';

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Organizational Audit"
        description="Assess your organization's HR maturity across 5 key domains."
        actions={
          <Link href="/audit/new">
            <Button>
              <Plus className="h-4 w-4" /> Start New Audit
            </Button>
          </Link>
        }
      />

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Run your first organizational audit to discover your HR maturity score and get
            actionable recommendations.
          </p>
          <Link href="/audit/new">
            <Button>
              Start Your First Audit <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
