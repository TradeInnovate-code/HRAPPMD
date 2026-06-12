'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';

interface RaciListItem {
  id: string;
  name: string;
  createdAt: string;
}

export default function RaciPage() {
  const [matrices, setMatrices] = useState<RaciListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/raci')
      .then((res) => res.json())
      .then((data) => setMatrices(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="RACI Matrices"
        description="Define accountability for every process and activity in your organization."
      >
        <Link href="/raci/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Matrix
          </Button>
        </Link>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : matrices.length === 0 ? (
        <motion.div {...motionPresets.fadeIn}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Grid3X3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No RACI matrices yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Create your first RACI matrix to clarify who is Responsible, Accountable, Consulted,
                and Informed.
              </p>
              <Link href="/raci/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Matrix
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matrices.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/raci/${m.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold leading-snug">{m.name}</h3>
                      <Badge variant="secondary">
                        <Grid3X3 className="mr-1 h-3 w-3" />
                        RACI
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(m.createdAt).toLocaleDateString()}
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
