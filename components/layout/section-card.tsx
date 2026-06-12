import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
  className,
  headerActions,
}: SectionCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        {headerActions && <div className="shrink-0">{headerActions}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
