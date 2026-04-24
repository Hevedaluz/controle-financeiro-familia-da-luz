import { LayoutDashboard, Building2, Bell } from 'lucide-react';
import { AbaAtiva } from '../types';

interface NavigationProps {
  abaAtiva: AbaAtiva;
  onChange: (aba: AbaAtiva) => void;
  lembretesPendentes: number;
}

const abas: { id: AbaAtiva; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'financas', label: 'Finanças', icon: LayoutDashboard },
  { id: 'empresa', label: 'Empresa', icon: Building2 },
  { id: 'lembretes', label: 'Lembretes', icon: Bell },
];

export default function Navigation({ abaAtiva, onChange, lembretesPendentes }: NavigationProps) {
  return (
    <>
      {/* Bottom navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-950/95 backdrop-blur-md border-t border-surface-800/60 safe-bottom">
        <div className="flex">
          {abas.map((aba) => {
            const Icon = aba.icon;
            const isActive = abaAtiva === aba.id;
            const hasBadge = aba.id === 'lembretes' && lembretesPendentes > 0;
            return (
              <button
                key={aba.id}
                onClick={() => onChange(aba.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 relative transition-all duration-200 ${
                  isActive ? 'text-brand-400' : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                  {hasBadge && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {lembretesPendentes > 9 ? '9+' : lembretesPendentes}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{aba.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-56 bg-surface-950 border-r border-surface-800/60 z-30 py-6 px-3">
        <p className="text-surface-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
        {abas.map((aba) => {
          const Icon = aba.icon;
          const isActive = abaAtiva === aba.id;
          const hasBadge = aba.id === 'lembretes' && lembretesPendentes > 0;
          return (
            <button
              key={aba.id}
              onClick={() => onChange(aba.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 text-left w-full ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                  : 'text-surface-400 hover:text-slate-200 hover:bg-surface-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {lembretesPendentes > 9 ? '9+' : lembretesPendentes}
                  </span>
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{aba.label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
}
