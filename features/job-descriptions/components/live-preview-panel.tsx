'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { JobDescriptionOutput } from '../schemas/jd.schemas';

interface LivePreviewPanelProps {
  result: (JobDescriptionOutput & { id: string; roleTitle: string }) | null;
}

export function LivePreviewPanel({ result }: LivePreviewPanelProps) {
  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the role details and click generate to see the AI output here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { title: 'Responsibilities', items: result.responsibilities },
    { title: 'Competencies', items: result.competencies },
    { title: 'KPIs', items: result.kpis },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">{result.roleTitle}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                draft
              </Badge>
            </div>
            <Link href={`/job-descriptions/${result.id}`}>
              <Button variant="outline" size="sm">
                Edit
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-5">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-2 text-foreground/80">{section.title}</h4>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
