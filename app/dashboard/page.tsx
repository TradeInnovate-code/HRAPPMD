import { PageHeader } from '@/components/layout/page-header';
import { ScoreCard } from '@/components/dashboard/score-card';
import { IssueListCard } from '@/components/dashboard/issue-list-card';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { ProgressWidget } from '@/components/dashboard/progress-widget';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome to HRI"
        description="Your AI-powered HR intelligence dashboard. Start by running an organizational audit."
      />

      {/* Score + Progress Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <ScoreCard score={null} />
        <ProgressWidget
          items={[
            { label: 'Audit', completed: false },
            { label: 'Job Descriptions', completed: false },
            { label: 'RACI Matrix', completed: false },
            { label: 'Exports', completed: false },
          ]}
        />
        <QuickActionCard />
      </div>

      {/* Issues Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IssueListCard issues={[]} />
      </div>
    </div>
  );
}
