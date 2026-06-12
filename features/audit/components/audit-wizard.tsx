'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from './progress-bar';
import { QuestionStep } from './question-step';
import type { AuditQuestion } from '../schemas/questions';
import type { AuditAnswer } from '../schemas/audit.schemas';
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';

interface AuditWizardProps {
  questions: AuditQuestion[];
  onComplete: (answers: AuditAnswer[]) => void;
  isSubmitting: boolean;
}

export function AuditWizard({ questions, onComplete, isSubmitting }: AuditWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const hasAnswer = !!answers[currentQuestion.key];
  const answeredCount = Object.keys(answers).length;

  function handleAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: value }));
  }

  function handleNext() {
    if (isLast) {
      const auditAnswers: AuditAnswer[] = Object.entries(answers).map(([key, value]) => ({
        questionKey: key,
        answerValue: value,
      }));
      onComplete(auditAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} answered={answeredCount} />

      <Card className="mt-6">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionStep
                question={currentQuestion}
                selectedValue={answers[currentQuestion.key] ?? null}
                onSelect={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={isFirst}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {totalQuestions}
            </span>

            <Button onClick={handleNext} disabled={!hasAnswer || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : isLast ? (
                <>
                  Submit <Send className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
