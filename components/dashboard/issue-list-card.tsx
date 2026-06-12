import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
}

interface IssueListCardProps {
  issues: Issue[];
}

const severityColors = {
  high: 'text-destructive bg-destructive/10',
  medium: 'text-warning bg-warning/10',
  low: 'text-muted-foreground bg-muted',
};

export function IssueListCard({ issues }: IssueListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Top Issues</CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No issues detected yet. Complete an audit to identify areas for improvement.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${severityColors[issue.severity]}`}
                >
                  {issue.severity}
                </span>
                <span className="text-sm font-medium">{issue.title}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
