'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number | null;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const hasScore = score !== null;

  function getScoreColor(s: number): string {
    if (s >= 80) return 'text-success';
    if (s >= 60) return 'text-primary';
    if (s >= 40) return 'text-warning';
    return 'text-destructive';
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Maturity Score</CardTitle>
      </CardHeader>
      <CardContent>
        {hasScore ? (
          <div className="flex items-baseline gap-2">
            <span className={cn('text-5xl font-bold tracking-tight', getScoreColor(score))}>
              {score}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <span className="text-4xl font-bold text-muted-foreground/30">—</span>
            <p className="mt-2 text-sm text-muted-foreground">Run an audit to see your score</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
