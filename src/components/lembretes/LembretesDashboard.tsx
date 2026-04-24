import { useState } from 'react';
import {
  Bell, Check, Trash2, Clock, AlertTriangle, CheckCircle2,
  PlusCircle, X, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';
import { Lembrete, TipoLembrete } from '../../types';
import { gerarId, dataHoje, formatarDataCompleta, formatarMoeda, diferencaDias } from '../../utils/helpers';

interface LembretesDashboardProps {
  lembretes: Lembrete[];
  onAdd: (l: Lembrete) => void;
  onTogglePago: (id: string) => void;
  onRemove: (id: string) => void;
}

function getStatusLembrete(lembrete: Lembrete): {
  cor: string;
  bgCor: string;
  borderCor: string;
  icone: React.ComponentType<{ className?: string }>;
  label: string;
} {
  if (lembrete.pago) {
    return {
      cor: 'text-surface-400',
      bgCor: 'bg-surface-800/30',
      borderCor: 'border-surface-700/20',
      icone: CheckCircle2,
      label: 'Concluído',
    };
  }
  const diff = diferencaDias(lembrete.dataVencimento);
  if (diff < 0) {
    return {
      cor: 'text-red-400',
      bgCor: 'bg-red-950/20',
      borderCor: 'border-red-900/40',
      icone: AlertTriangle,
      label: `Vencido há ${Math.abs(diff)} dia${Math.abs(diff) !== 1 ? 's' : ''}`,
    };
  }
  if (diff <= 3) {
    return {
      cor: 'text-yellow-400',
      bgCor: 'bg-yellow-950/20',
      borderCor: 'border-yellow-900/40',
      icone: Clock,
      label: diff === 0 ? 'Vence hoje!' : `Vence em ${diff} dia${diff !== 1 ? 's' : ''}`,
    };
  }
  return {
    cor: 'text-green-400',
    bgCor: 'bg-green-950/10',
    borderCor: 'border-green-900/20',
    icone: Check,
    label: `Vence em ${diff} dias`,
  };
}

function NovoLembreteForm({ onAdd }: { onAdd: (l: Lembrete) => void }) {
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [dataVenc, setDataVenc] = useState(dataHoje());
  const [tipo, setTipo] = useState<TipoLembrete>('pagar');
  const [valor, setValor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;
    onAdd({
      id: gerarId(),
      descricao: descricao.trim(),
      dataVencimento: dataVenc,
      tipo,
      valor: parseFloat(valor) || 0,
      pago: false,
      createdAt: new Date().toISOString(),
    });
    setDescricao('');
    setDataVenc(dataHoje());
    setTipo('pagar');
    setValor('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-surface-700 rounded-xl text-surface-400 hover:text-slate-300 hover:border-surface-600 transition-all text-sm font-medium"
      >
        <PlusCircle className="w-4 h-4" />
        Novo Lembrete
      </button>
    );
  }

  return (
    <div className="card p-4 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-300 text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          Novo Lembrete
        </h3>
        <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input-field text-sm"
          placeholder="Descrição (ex: Fatura do cartão)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTipo('pagar')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
              tipo === 'pagar'
                ? 'bg-red-900/30 border-red-800/60 text-red-400'
                : 'bg-surface-800 border-surface-700 text-surface-400 hover:text-slate-300'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Pagar
          </button>
          <button
            type="button"
            onClick={() => setTipo('receber')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
              tipo === 'receber'
                ? 'bg-green-900/30 border-green-800/60 text-green-400'
                : 'bg-surface-800 border-surface-700 text-surface-400 hover:text-slate-300'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Receber
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">R$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field text-sm pl-9"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="input-field text-sm"
            value={dataVenc}
            onChange={(e) => setDataVenc(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full btn-primary text-sm py-2.5">
          Salvar Lembrete
        </button>
      </form>
    </div>
  );
}

export default function LembretesDashboard({ lembretes, onAdd, onTogglePago, onRemove }: LembretesDashboardProps) {
  const [filtro, setFiltro] = useState<'todos' | 'pendentes' | 'pagos'>('pendentes');

  const lembretesFiltrados = lembretes
    .filter((l) => {
      if (filtro === 'pendentes') return !l.pago;
      if (filtro === 'pagos') return l.pago;
      return true;
    })
    .sort((a, b) => {
      if (a.pago !== b.pago) return a.pago ? 1 : -1;
      return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
    });

  const vencidos = lembretes.filter((l) => !l.pago && diferencaDias(l.dataVencimento) < 0);
  const hojeOuBreve = lembretes.filter((l) => !l.pago && diferencaDias(l.dataVencimento) >= 0 && diferencaDias(l.dataVencimento) <= 3);
  const pendentes = lembretes.filter((l) => !l.pago);

  const totalAPagar = pendentes.filter((l) => l.tipo === 'pagar').reduce((sum, l) => sum + l.valor, 0);
  const totalAReceber = pendentes.filter((l) => l.tipo === 'receber').reduce((sum, l) => sum + l.valor, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Cards de alerta */}
      <div className="grid grid-cols-2 gap-3">
        {vencidos.length > 0 && (
          <div className="col-span-2 flex items-center gap-3 p-3 bg-red-950/30 border border-red-900/40 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse-slow" />
            <div>
              <p className="text-red-300 text-xs font-semibold">{vencidos.length} lembrete{vencidos.length !== 1 ? 's' : ''} vencido{vencidos.length !== 1 ? 's' : ''}!</p>
              <p className="text-red-500/70 text-xs">Verifique os pagamentos em atraso</p>
            </div>
          </div>
        )}
        {hojeOuBreve.length > 0 && (
          <div className="col-span-2 flex items-center gap-3 p-3 bg-yellow-950/20 border border-yellow-900/30 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-300 text-xs font-medium">
              {hojeOuBreve.length} lembrete{hojeOuBreve.length !== 1 ? 's' : ''} vencendo em breve
            </p>
          </div>
        )}
        <div className="stat-card-red">
          <p className="text-surface-400 text-xs mb-1 uppercase tracking-wide">A Pagar</p>
          <p className="text-lg font-bold gradient-text-red text-money">{formatarMoeda(totalAPagar)}</p>
        </div>
        <div className="stat-card-green">
          <p className="text-surface-400 text-xs mb-1 uppercase tracking-wide">A Receber</p>
          <p className="text-lg font-bold gradient-text-green text-money">{formatarMoeda(totalAReceber)}</p>
        </div>
      </div>

      {/* Form novo lembrete */}
      <NovoLembreteForm onAdd={onAdd} />

      {/* Filtros */}
      <div className="flex gap-1 bg-surface-900 p-1 rounded-xl border border-surface-800">
        {[
          { id: 'pendentes', label: `Pendentes (${pendentes.length})` },
          { id: 'todos', label: 'Todos' },
          { id: 'pagos', label: 'Concluídos' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFiltro(item.id as typeof filtro)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              filtro === item.id ? 'bg-surface-700 text-slate-100' : 'text-surface-500 hover:text-surface-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Lista de lembretes */}
      {lembretesFiltrados.length === 0 ? (
        <div className="text-center py-10 text-surface-500 text-sm">
          {filtro === 'pendentes' ? 'Nenhum lembrete pendente' : 'Nenhum lembrete encontrado'}
        </div>
      ) : (
        <div className="space-y-2">
          {lembretesFiltrados.map((lembrete) => {
            const status = getStatusLembrete(lembrete);
            const StatusIcon = status.icone;
            return (
              <div
                key={lembrete.id}
                className={`p-3.5 rounded-xl border transition-all ${lembrete.pago ? 'opacity-60' : ''} ${status.bgCor} ${status.borderCor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    lembrete.tipo === 'pagar' ? 'bg-red-900/40' : 'bg-green-900/40'
                  }`}>
                    {lembrete.tipo === 'pagar'
                      ? <ArrowDownCircle className="w-4 h-4 text-red-400" />
                      : <ArrowUpCircle className="w-4 h-4 text-green-400" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${lembrete.pago ? 'line-through text-surface-500' : 'text-slate-200'}`}>
                      {lembrete.descricao}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-surface-500">
                        {lembrete.tipo === 'pagar' ? 'Pagar' : 'Receber'} em {formatarDataCompleta(lembrete.dataVencimento)}
                      </span>
                      {lembrete.valor > 0 && (
                        <span className={`text-xs font-semibold text-money ${lembrete.tipo === 'pagar' ? 'text-red-400' : 'text-green-400'}`}>
                          {formatarMoeda(lembrete.valor)}
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1.5 ${status.cor}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{status.label}</span>
                    </div>
                    {lembrete.pago && lembrete.pagoEm && (
                      <p className="text-xs text-surface-500 mt-0.5">
                        Concluído em {formatarDataCompleta(lembrete.pagoEm)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => onTogglePago(lembrete.id)}
                      className={`p-1.5 rounded-lg transition-all ${
                        lembrete.pago
                          ? 'text-surface-500 hover:text-slate-300 bg-surface-800'
                          : 'text-white bg-green-700 hover:bg-green-600'
                      }`}
                      title={lembrete.pago ? 'Desfazer' : 'Marcar como pago/recebido'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(lembrete.id)}
                      className="p-1.5 rounded-lg text-surface-600 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
