import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Entrada } from '../../types';
import { gerarId, dataHoje } from '../../utils/helpers';

interface EntradaFormProps {
  onAdd: (entrada: Entrada) => void;
}

export default function EntradaForm({ onAdd }: EntradaFormProps) {
  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(dataHoje());

  const sugestoes = ['Salário Hevertton', 'Salário Esposa', 'Freelance', 'Aluguel Recebido', 'Outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valor || parseFloat(valor) <= 0) return;

    onAdd({
      id: gerarId(),
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      data,
      createdAt: new Date().toISOString(),
    });

    setDescricao('');
    setValor('');
    setData(dataHoje());
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-green-800/50 rounded-xl text-green-500 hover:text-green-400 hover:border-green-700 transition-all text-sm font-medium"
      >
        <PlusCircle className="w-4 h-4" />
        Adicionar Entrada
      </button>
    );
  }

  return (
    <div className="card p-4 border-green-800/30 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-green-400 text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Nova Entrada
        </h3>
        <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            className="input-field text-sm"
            placeholder="Descrição (ex: Salário Hevertton)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            list="sugestoes-entrada"
            required
          />
          <datalist id="sugestoes-entrada">
            {sugestoes.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

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

        <button type="submit" className="w-full btn-primary text-sm py-2.5">
          Salvar Entrada
        </button>
      </form>
    </div>
  );
}
