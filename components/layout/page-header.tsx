import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, children, className }: PageHeaderProps) {
  const actionContent = children ?? actions;
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-8', className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {actionContent && <div className="flex items-center gap-3 shrink-0">{actionContent}</div>}
    </div>
  );
}
