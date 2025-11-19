import { ReactNode } from 'react';
import { PanelNav } from '@/components/panel/PanelNav';
import { PanelAuthGuard } from '@/components/panel/PanelAuthGuard';

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <PanelAuthGuard requiredRole="hotelier">
      <div className="min-h-screen bg-gray-50">
        <PanelNav />
        <main>{children}</main>
      </div>
    </PanelAuthGuard>
  );
}
