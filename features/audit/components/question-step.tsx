'use client';

import { cn } from '@/lib/utils';
import { DOMAIN_LABELS, type AuditQuestion } from '../schemas/questions';
import { Badge } from '@/components/ui/badge';

interface QuestionStepProps {
  question: AuditQuestion;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function QuestionStep({ question, selectedValue, onSelect }: QuestionStepProps) {
  return (
    <div>
      <div className="mb-6">
        <Badge variant="secondary" className="mb-3">
          {DOMAIN_LABELS[question.domain]}
        </Badge>
        <h3 className="text-xl font-semibold leading-relaxed">{question.text}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              'w-full rounded-xl border-2 p-4 text-left transition-all duration-200',
              selectedValue === option.value
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/30 hover:bg-accent/50',
            )}
          >
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
