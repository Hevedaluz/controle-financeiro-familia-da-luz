import { useState } from 'react';
import { Package, PlusCircle, X } from 'lucide-react';
import { Produto } from '../../types';
import { gerarId } from '../../utils/helpers';

interface ProdutoFormProps {
  onAdd: (produto: Produto) => void;
}

export default function ProdutoForm({ onAdd }: ProdutoFormProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [precoCompra, setPrecoCompra] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [estoque, setEstoque] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const pc = parseFloat(precoCompra) || 0;
    const pv = parseFloat(precoVenda) || 0;
    const est = parseInt(estoque) || 0;

    onAdd({
      id: gerarId(),
      nome: nome.trim(),
      precoCompra: pc,
      precoVenda: pv,
      estoque: est,
      createdAt: new Date().toISOString(),
    });

    setNome('');
    setPrecoCompra('');
    setPrecoVenda('');
    setEstoque('1');
    setOpen(false);
  };

  const margem = precoCompra && precoVenda
    ? (((parseFloat(precoVenda) - parseFloat(precoCompra)) / parseFloat(precoCompra)) * 100).toFixed(0)
    : null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-800/50 rounded-xl text-blue-400 hover:text-blue-300 hover:border-blue-700 transition-all text-sm font-medium"
      >
        <PlusCircle className="w-4 h-4" />
        Cadastrar Produto
      </button>
    );
  }

  return (
    <div className="card p-4 border-blue-800/30 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-400 text-sm flex items-center gap-2">
          <Package className="w-4 h-4" />
          Novo Produto
        </h3>
        <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input-field text-sm"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-surface-500 mb-1 block">Preço de Compra</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field text-sm pl-9"
                placeholder="0,00"
                value={precoCompra}
                onChange={(e) => setPrecoCompra(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-surface-500 mb-1 block">Preço de Venda</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field text-sm pl-9"
                placeholder="0,00"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
              />
            </div>
          </div>
        </div>

        {margem && (
          <div className={`text-xs font-medium px-3 py-1.5 rounded-lg ${parseFloat(margem) >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            Margem de lucro: {margem}%
          </div>
        )}

        <div>
          <label className="text-xs text-surface-500 mb-1 block">Estoque Inicial</label>
          <input
            type="number"
            min="0"
            className="input-field text-sm"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-sm">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}
