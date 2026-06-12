'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RaciGrid } from '@/features/raci/components/raci-grid';
import { Save, Loader2 } from 'lucide-react';
import type { RaciCell, RaciValue } from '@/features/raci/schemas/raci.schemas';

interface RoleStub {
  id: string;
  title: string;
}

export default function NewRaciPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [activities, setActivities] = useState<string[]>(['']);
  const [roles, setRoles] = useState<RoleStub[]>([]);
  const [cells, setCells] = useState<Record<string, RaciValue>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load organization roles
  useEffect(() => {
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRoles(data);
      })
      .catch(() => {});
  }, []);

  function handleCellChange(roleId: string, activity: string, value: RaciValue) {
    setCells((prev) => ({ ...prev, [`${roleId}::${activity}`]: value }));
  }

  function addActivity() {
    setActivities((prev) => [...prev, '']);
  }

  function updateActivity(index: number, value: string) {
    setActivities((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  function removeActivity(index: number) {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    const cleanActivities = activities.map((a) => a.trim()).filter(Boolean);
    if (!name.trim()) {
      setError('Matrix name is required');
      return;
    }
    if (cleanActivities.length === 0) {
      setError('At least one activity is required');
      return;
    }

    // Build cells array from state
    const raciCells: RaciCell[] = [];
    for (const role of roles) {
      for (const activity of cleanActivities) {
        const key = `${role.id}::${activity}`;
        const value = cells[key] || '';
        raciCells.push({ roleId: role.id, activity, value });
      }
    }

    if (raciCells.filter((c) => c.value !== '').length === 0) {
      setError('Assign at least one RACI value');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/raci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), cells: raciCells }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Failed to save');
        return;
      }

      router.push(`/raci/${json.id}`);
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New RACI Matrix"
        description="Define activities, assign roles, and clarify accountability."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Matrix Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Matrix Name</Label>
            <Input
              id="name"
              placeholder="e.g. Hiring Process, Onboarding Workflow"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Activities / Tasks</Label>
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder={`Activity ${i + 1}`}
                  value={activity}
                  onChange={(e) => updateActivity(i, e.target.value)}
                />
                {activities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(i)}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addActivity}>
              + Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {roles.length > 0 && activities.filter((a) => a.trim()).length > 0 && (
        <RaciGrid
          roles={roles}
          activities={activities.filter((a) => a.trim())}
          cells={cells}
          onCellChange={handleCellChange}
        />
      )}

      {roles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No roles found. Create roles via Job Descriptions first, then build a RACI matrix.
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push('/raci')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Matrix
        </Button>
      </div>
    </div>
  );
}
