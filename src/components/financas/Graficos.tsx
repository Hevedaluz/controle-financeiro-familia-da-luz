import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Saida, Entrada } from '../../types';
import { formatarMoeda, getMesesAnteriores } from '../../utils/helpers';

// Paleta de cores para categorias
const CORES_GRAFICO = [
  '#22c55e', '#eab308', '#3b82f6', '#f97316', '#a855f7',
  '#06b6d4', '#ec4899', '#84cc16', '#f43f5e', '#10b981',
  '#6366f1', '#f59e0b', '#14b8a6', '#8b5cf6',
];

interface GraficosProps {
  saidas: Saida[];
  todasEntradas: Entrada[];
  todasSaidas: Saida[];
}

export default function Graficos({ saidas, todasEntradas, todasSaidas }: GraficosProps) {
  // Dados para pizza (por categoria)
  const dadosPizza = saidas.reduce<Record<string, number>>((acc, saida) => {
    acc[saida.categoria] = (acc[saida.categoria] || 0) + saida.valor;
    return acc;
  }, {});

  const dadosPizzaArray = Object.entries(dadosPizza)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Dados para barras (últimos 6 meses)
  const meses = getMesesAnteriores(6);
  const dadosBarras = meses.map(({ mes, ano, label }) => {
    const entradas = todasEntradas
      .filter((e) => {
        const d = new Date(e.data);
        return d.getMonth() + 1 === mes && d.getFullYear() === ano;
      })
      .reduce((sum, e) => sum + e.valor, 0);

    const saidasMes = todasSaidas
      .filter((s) => {
        const d = new Date(s.data);
        return d.getMonth() + 1 === mes && d.getFullYear() === ano;
      })
      .reduce((sum, s) => sum + s.valor, 0);

    return { label, entradas, saidas: saidasMes };
  });

  const CustomTooltipPizza = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-3 shadow-xl text-xs">
          <p className="font-semibold text-slate-200">{payload[0].name}</p>
          <p className="text-green-400 text-money">{formatarMoeda(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBarras = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.fill }} className="text-money">
              {p.name === 'entradas' ? 'Entradas' : 'Saídas'}: {formatarMoeda(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Gráfico de Pizza */}
      {dadosPizzaArray.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Gastos por Categoria</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dadosPizzaArray}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dadosPizzaArray.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipPizza />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legenda */}
            <div className="flex flex-wrap sm:flex-col gap-2 sm:gap-1.5 max-h-48 overflow-y-auto">
              {dadosPizzaArray.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CORES_GRAFICO[index % CORES_GRAFICO.length] }}
                  />
                  <span className="text-xs text-surface-400 truncate">{item.name}</span>
                  <span className="text-xs text-money text-slate-300 ml-auto">{formatarMoeda(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Barras */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Entradas × Saídas — Últimos 6 Meses</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dadosBarras} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltipBarras />} />
            <Legend
              formatter={(value) => <span className="text-xs text-surface-400">{value === 'entradas' ? 'Entradas' : 'Saídas'}</span>}
            />
            <Bar dataKey="entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saidas" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
