import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { Entrada, Saida } from '../../types';
import { formatarMesAno, getMesAtual } from '../../utils/helpers';
import ResumoCards from './ResumoCards';
import EntradaForm from './EntradaForm';
import SaidaForm from './SaidaForm';
import { ListaEntradas, ListaSaidas } from './TransacaoList';
import Graficos from './Graficos';

interface FinancasDashboardProps {
  entradas: Entrada[];
  saidas: Saida[];
  onAddEntrada: (e: Entrada) => void;
  onAddSaida: (s: Saida) => void;
  onRemoveEntrada: (id: string) => void;
  onRemoveSaida: (id: string) => void;
}

export default function FinancasDashboard({
  entradas, saidas, onAddEntrada, onAddSaida, onRemoveEntrada, onRemoveSaida
}: FinancasDashboardProps) {
  const atual = getMesAtual();
  const [mes, setMes] = useState(atual.mes);
  const [ano, setAno] = useState(atual.ano);
  const [subAba, setSubAba] = useState<'resumo' | 'entradas' | 'saidas' | 'graficos'>('resumo');

  const navMes = (direcao: -1 | 1) => {
    let novoMes = mes + direcao;
    let novoAno = ano;
    if (novoMes > 12) { novoMes = 1; novoAno++; }
    if (novoMes < 1) { novoMes = 12; novoAno--; }
    setMes(novoMes);
    setAno(novoAno);
  };

  const entradasFiltradas = entradas.filter((e) => {
    const d = new Date(e.data);
    return d.getMonth() + 1 === mes && d.getFullYear() === ano;
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const saidasFiltradas = saidas.filter((s) => {
    const d = new Date(s.data);
    return d.getMonth() + 1 === mes && d.getFullYear() === ano;
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalEntradas = entradasFiltradas.reduce((sum, e) => sum + e.valor, 0);
  const totalSaidas = saidasFiltradas.reduce((sum, s) => sum + s.valor, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Seletor de mês */}
      <div className="flex items-center justify-between">
        <button onClick={() => navMes(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-300 transition-all active:scale-90">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-slate-200 capitalize">
          {formatarMesAno(ano, mes)}
        </h2>
        <button onClick={() => navMes(1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-300 transition-all active:scale-90">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Cards de resumo */}
      <ResumoCards totalEntradas={totalEntradas} totalSaidas={totalSaidas} />

      {/* Sub-navegação */}
      <div className="flex gap-1 bg-surface-900 p-1 rounded-xl border border-surface-800">
        {[
          { id: 'resumo', label: 'Resumo', icon: BarChart2 },
          { id: 'entradas', label: `Entradas (${entradasFiltradas.length})`, icon: TrendingUp },
          { id: 'saidas', label: `Saídas (${saidasFiltradas.length})`, icon: TrendingDown },
          { id: 'graficos', label: 'Gráficos', icon: BarChart2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSubAba(item.id as typeof subAba)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                subAba === item.id
                  ? 'bg-surface-700 text-slate-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 hidden sm:block" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo por sub-aba */}
      {subAba === 'resumo' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              Últimas Entradas
            </h3>
            <EntradaForm onAdd={onAddEntrada} />
            <ListaEntradas entradas={entradasFiltradas.slice(0, 5)} onRemove={onRemoveEntrada} />
            {entradasFiltradas.length > 5 && (
              <button onClick={() => setSubAba('entradas')} className="w-full text-center text-xs text-brand-400 hover:text-brand-300 py-1">
                Ver todas ({entradasFiltradas.length})
              </button>
            )}
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5 text-yellow-500" />
              Últimas Saídas
            </h3>
            <SaidaForm onAdd={onAddSaida} />
            <ListaSaidas saidas={saidasFiltradas.slice(0, 5)} onRemove={onRemoveSaida} />
            {saidasFiltradas.length > 5 && (
              <button onClick={() => setSubAba('saidas')} className="w-full text-center text-xs text-brand-400 hover:text-brand-300 py-1">
                Ver todas ({saidasFiltradas.length})
              </button>
            )}
          </div>
        </div>
      )}

      {subAba === 'entradas' && (
        <div className="card p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Entradas — {formatarMesAno(ano, mes)}
          </h3>
          <EntradaForm onAdd={onAddEntrada} />
          <ListaEntradas entradas={entradasFiltradas} onRemove={onRemoveEntrada} />
        </div>
      )}

      {subAba === 'saidas' && (
        <div className="card p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-yellow-400" />
            Saídas — {formatarMesAno(ano, mes)}
          </h3>
          <SaidaForm onAdd={onAddSaida} />
          <ListaSaidas saidas={saidasFiltradas} onRemove={onRemoveSaida} />
        </div>
      )}

      {subAba === 'graficos' && (
        <div className="animate-fade-in">
          <Graficos saidas={saidasFiltradas} todasEntradas={entradas} todasSaidas={saidas} />
        </div>
      )}
    </div>
  );
}
