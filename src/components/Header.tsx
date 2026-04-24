import { Shield, Bell, Download, Upload } from 'lucide-react';
import { AppData } from '../types';

interface HeaderProps {
  onExport: () => void;
  onImport: (data: AppData) => void;
  lembretesPendentes: number;
}

export default function Header({ onExport, onImport, lembretesPendentes }: HeaderProps) {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as AppData;
          if (data.entradas !== undefined && data.saidas !== undefined) {
            onImport(data);
            alert('Dados importados com sucesso!');
          } else {
            alert('Arquivo inválido. Selecione um backup do Controle Financeiro.');
          }
        } catch {
          alert('Erro ao ler o arquivo. Certifique-se que é um JSON válido.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-950/95 backdrop-blur-md border-b border-surface-800/60">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-sm text-white leading-none block">Controle Financeiro</span>
            <span className="text-brand-400 text-xs font-medium leading-none block">Família da Luz</span>
          </div>
          <div className="sm:hidden">
            <span className="font-semibold text-sm text-white">CF · Família da Luz</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {lembretesPendentes > 0 && (
            <div className="relative mr-1">
              <Bell className="w-5 h-5 text-yellow-400 animate-bounce-subtle" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {lembretesPendentes > 9 ? '9+' : lembretesPendentes}
              </span>
            </div>
          )}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-surface-400 hover:text-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-surface-800 transition-all text-xs font-medium"
            title="Exportar backup"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Backup</span>
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 text-surface-400 hover:text-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-surface-800 transition-all text-xs font-medium"
            title="Importar backup"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
