'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableListBlockProps {
  title: string;
  items: string[];
  onSave: (items: string[]) => void;
  saving?: boolean;
}

export function EditableListBlock({ title, items, onSave, saving }: EditableListBlockProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(items);

  function startEdit() {
    setDraft([...items]);
    setEditing(true);
  }

  function handleSave() {
    const cleaned = draft.map((s) => s.trim()).filter(Boolean);
    onSave(cleaned);
    setEditing(false);
  }

  function updateItem(index: number, value: string) {
    setDraft((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function removeItem(index: number) {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  }

  function addItem() {
    setDraft((prev) => [...prev, '']);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {editing ? (
          <Button size="sm" variant="default" onClick={handleSave} disabled={saving}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={startEdit}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          {editing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {draft.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(i, e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(i)}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Item
              </Button>
            </motion.div>
          ) : (
            <motion.ul
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
