import { ReactNode } from 'react';
import { PanelNav } from '@/components/panel/PanelNav';

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PanelNav />
      <main>{children}</main>
    </div>
  );
}
