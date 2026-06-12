'use client';

import { PageHeader } from '@/components/layout/page-header';
import { User, Shield, Building } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, organization, and preferences."
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" /> Profile
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">Dev Admin</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">admin@hri.local</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">Administrator</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" /> Organization
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-medium">Dev Organization</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">Development</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" /> Security
          </h2>
          <p className="text-sm text-muted-foreground">
            Running in development mode with local authentication. Configure Clerk API keys in{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code> for
            production authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
