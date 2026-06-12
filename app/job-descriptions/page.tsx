'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';

interface JDListItem {
  id: string;
  status: string;
  roleTitle: string;
  department: string | null;
  level: string | null;
  createdAt: string;
}

export default function JobDescriptionsPage() {
  const [jds, setJds] = useState<JDListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/job-descriptions')
      .then((res) => res.json())
      .then((data) => {
        setJds(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Descriptions"
        description="AI-generated role profiles with responsibilities, competencies, and KPIs."
      >
        <Link href="/job-descriptions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate New
          </Button>
        </Link>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : jds.length === 0 ? (
        <motion.div {...motionPresets.fadeIn}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No job descriptions yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Generate your first AI-powered job description to define clear role expectations.
              </p>
              <Link href="/job-descriptions/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate First JD
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jds.map((jd, i) => (
            <motion.div
              key={jd.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/job-descriptions/${jd.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold leading-snug">{jd.roleTitle}</h3>
                      <Badge variant={jd.status === 'published' ? 'success' : 'secondary'}>
                        {jd.status}
                      </Badge>
                    </div>
                    {(jd.department || jd.level) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {jd.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {jd.department}
                          </span>
                        )}
                        {jd.level && <span>• {jd.level}</span>}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(jd.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
