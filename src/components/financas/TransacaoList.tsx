import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Entrada, Saida } from '../../types';
import { formatarMoeda, formatarData } from '../../utils/helpers';

// Cores por categoria
const CATEGORIA_CORES: Record<string, string> = {
  Aluguel: 'text-purple-400',
  Luz: 'text-yellow-400',
  'Água': 'text-blue-400',
  'Condomínio': 'text-orange-400',
  Internet: 'text-cyan-400',
  'Gás': 'text-orange-300',
  Comida: 'text-green-400',
  Gasolina: 'text-red-400',
  'Saúde': 'text-pink-400',
  'Educação': 'text-indigo-400',
  Lazer: 'text-violet-400',
  Roupas: 'text-rose-400',
  Transporte: 'text-amber-400',
  Outros: 'text-surface-400',
};

interface ListaEntradasProps {
  entradas: Entrada[];
  onRemove: (id: string) => void;
}

export function ListaEntradas({ entradas, onRemove }: ListaEntradasProps) {
  if (entradas.length === 0) {
    return (
      <div className="text-center py-6 text-surface-500 text-sm">
        Nenhuma entrada neste mês
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entradas.map((entrada) => (
        <div key={entrada.id} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl border border-surface-700/30 group">
          <div className="w-8 h-8 rounded-lg bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{entrada.descricao}</p>
            <p className="text-xs text-surface-500">{formatarData(entrada.data)}</p>
          </div>
          <span className="text-sm font-semibold text-green-400 text-money flex-shrink-0">
            +{formatarMoeda(entrada.valor)}
          </span>
          <button
            onClick={() => onRemove(entrada.id)}
            className="opacity-0 group-hover:opacity-100 text-surface-600 hover:text-red-400 transition-all p-1 flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface ListaSaidasProps {
  saidas: Saida[];
  onRemove: (id: string) => void;
}

export function ListaSaidas({ saidas, onRemove }: ListaSaidasProps) {
  if (saidas.length === 0) {
    return (
      <div className="text-center py-6 text-surface-500 text-sm">
        Nenhuma saída neste mês
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {saidas.map((saida) => (
        <div key={saida.id} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl border border-surface-700/30 group">
          <div className="w-8 h-8 rounded-lg bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{saida.descricao}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-medium ${CATEGORIA_CORES[saida.categoria] ?? 'text-surface-400'}`}>
                {saida.categoria}
              </span>
              <span className="text-surface-600 text-xs">·</span>
              <span className="text-xs text-surface-500">{formatarData(saida.data)}</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-yellow-400 text-money flex-shrink-0">
            -{formatarMoeda(saida.valor)}
          </span>
          <button
            onClick={() => onRemove(saida.id)}
            className="opacity-0 group-hover:opacity-100 text-surface-600 hover:text-red-400 transition-all p-1 flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
