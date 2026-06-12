'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AuditResult } from '../schemas/audit.schemas';
import { ArrowRight, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendationPanelProps {
  result: AuditResult;
  onGoToDashboard: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

export function RecommendationPanel({ result, onGoToDashboard }: RecommendationPanelProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div
            className={cn(
              'text-7xl font-bold tracking-tight mb-2',
              getScoreColor(result.overallScore),
            )}
          >
            {result.overallScore}
          </div>
          <p className="text-lg text-muted-foreground">/ 100</p>
          <Badge
            variant={result.overallScore >= 60 ? 'secondary' : 'destructive'}
            className="mt-3 text-sm"
          >
            {getScoreLabel(result.overallScore)}
          </Badge>
        </CardContent>
      </Card>

      {/* Domain Scores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {result.domainScores.map((ds) => (
          <Card key={ds.domain}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{ds.label}</p>
              <p className={cn('text-2xl font-bold', getScoreColor(ds.score))}>{ds.score}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Issues */}
      {result.topIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Key Issues Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.topIssues.map((issue) => (
                <li key={issue.id} className="flex items-center gap-3">
                  <Badge
                    variant={
                      issue.severity === 'high'
                        ? 'destructive'
                        : issue.severity === 'medium'
                          ? 'warning'
                          : 'secondary'
                    }
                    className="shrink-0"
                  >
                    {issue.severity}
                  </Badge>
                  <span className="text-sm">{issue.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendedActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={onGoToDashboard}>
          Go to Dashboard <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
