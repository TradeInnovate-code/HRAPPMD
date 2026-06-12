'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export function ProgressBar({ current, total, answered }: ProgressBarProps) {
  const percentage = Math.round((answered / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{percentage}% complete</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
