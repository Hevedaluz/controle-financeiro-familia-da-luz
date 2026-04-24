import { useState } from 'react';
import { MinusCircle, X } from 'lucide-react';
import { Saida, CATEGORIAS } from '../../types';
import { gerarId, dataHoje } from '../../utils/helpers';

interface SaidaFormProps {
  onAdd: (saida: Saida) => void;
}

export default function SaidaForm({ onAdd }: SaidaFormProps) {
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(dataHoje());
  const [categoria, setCategoria] = useState<string>('Outros');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valor || parseFloat(valor) <= 0) return;

    onAdd({
      id: gerarId(),
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      data,
      categoria: categoria as Saida['categoria'],
      createdAt: new Date().toISOString(),
    });

    setDescricao('');
    setValor('');
    setData(dataHoje());
    setCategoria('Outros');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-yellow-800/50 rounded-xl text-yellow-500 hover:text-yellow-400 hover:border-yellow-700 transition-all text-sm font-medium"
      >
        <MinusCircle className="w-4 h-4" />
        Adicionar Saída / Dívida
      </button>
    );
  }

  return (
    <div className="card p-4 border-yellow-800/30 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-yellow-400 text-sm flex items-center gap-2">
          <MinusCircle className="w-4 h-4" />
          Nova Saída / Dívida
        </h3>
        <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input-field text-sm"
          placeholder="Descrição (ex: Conta de Luz - Fevereiro)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <select
          className="select-field text-sm"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">R$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input-field text-sm pl-9"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>
          <input
            type="date"
            className="input-field text-sm"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-sm">
          Salvar Saída
        </button>
      </form>
    </div>
  );
}
