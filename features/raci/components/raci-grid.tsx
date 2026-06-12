'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RaciValue } from '../schemas/raci.schemas';

const RACI_OPTIONS: { value: RaciValue; label: string; color: string }[] = [
  { value: '', label: '—', color: 'bg-muted hover:bg-muted/80' },
  { value: 'R', label: 'R', color: 'bg-[#1F2179] text-white hover:bg-[#1F2179]/85' },
  { value: 'A', label: 'A', color: 'bg-[#EE6666] text-white hover:bg-[#EE6666]/85' },
  { value: 'C', label: 'C', color: 'bg-[#3291C9] text-white hover:bg-[#3291C9]/85' },
  { value: 'I', label: 'I', color: 'bg-[#28A745] text-white hover:bg-[#28A745]/85' },
];

interface RaciGridProps {
  roles: { id: string; title: string }[];
  activities: string[];
  cells: Record<string, RaciValue>;
  onCellChange: (roleId: string, activity: string, value: RaciValue) => void;
}

export function RaciGrid({ roles, activities, cells, onCellChange }: RaciGridProps) {
  function cycleValue(current: RaciValue): RaciValue {
    const order: RaciValue[] = ['', 'R', 'A', 'C', 'I'];
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assignment Grid</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium sticky left-0 bg-muted/50 z-10">Activity</th>
              {roles.map((role) => (
                <th key={role.id} className="p-3 text-center font-medium min-w-[90px]">
                  {role.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity} className="border-b last:border-b-0">
                <td className="p-3 font-medium sticky left-0 bg-background z-10">{activity}</td>
                {roles.map((role) => {
                  const key = `${role.id}::${activity}`;
                  const current = cells[key] || '';
                  const option = RACI_OPTIONS.find((o) => o.value === current) || RACI_OPTIONS[0];

                  return (
                    <td key={role.id} className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onCellChange(role.id, activity, cycleValue(current))}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-colors cursor-pointer ${option.color}`}
                        title={`Click to cycle: R → A → C → I → clear`}
                      >
                        {option.label}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
