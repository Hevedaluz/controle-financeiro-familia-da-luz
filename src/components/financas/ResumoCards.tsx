import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatarMoeda } from '../../utils/helpers';

interface ResumoCardsProps {
  totalEntradas: number;
  totalSaidas: number;
}

export default function ResumoCards({ totalEntradas, totalSaidas }: ResumoCardsProps) {
  const saldo = totalEntradas - totalSaidas;
  const isPositivo = saldo >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Total Entradas */}
      <div className="stat-card-green">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-900/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-surface-400 text-xs font-medium uppercase tracking-wide">Entradas</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-money gradient-text-green">
          {formatarMoeda(totalEntradas)}
        </p>
      </div>

      {/* Total Saídas */}
      <div className="stat-card-yellow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-900/60 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-surface-400 text-xs font-medium uppercase tracking-wide">Saídas</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-money gradient-text-yellow">
          {formatarMoeda(totalSaidas)}
        </p>
      </div>

      {/* Saldo */}
      <div className={isPositivo ? 'stat-card-green' : 'stat-card-red'}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${isPositivo ? 'bg-green-900/60' : 'bg-red-900/60'} flex items-center justify-center`}>
              <Wallet className={`w-4 h-4 ${isPositivo ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <span className="text-surface-400 text-xs font-medium uppercase tracking-wide">Saldo</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositivo
              ? 'bg-green-900/40 text-green-400'
              : 'bg-red-900/40 text-red-400'
          }`}>
            {isPositivo ? 'Positivo' : 'Negativo'}
          </span>
        </div>
        <p className={`text-2xl font-bold text-money ${isPositivo ? 'gradient-text-green' : 'gradient-text-red'}`}>
          {formatarMoeda(saldo)}
        </p>
      </div>
    </div>
  );
}
