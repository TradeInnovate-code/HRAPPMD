'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressItem {
  label: string;
  completed: boolean;
}

interface ProgressWidgetProps {
  items: ProgressItem[];
}

export function ProgressWidget({ items }: ProgressWidgetProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const percentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Setup Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{items.length} steps
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5">
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={cn(
                  'text-sm',
                  item.completed ? 'text-foreground line-through' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
