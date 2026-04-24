import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Produto, Venda } from '../../types';
import { gerarId, dataHoje, formatarMoeda } from '../../utils/helpers';

interface VendaFormProps {
  produtos: Produto[];
  onVenda: (venda: Venda, estoqueAtualizado: Produto) => void;
}

export default function VendaForm({ produtos, onVenda }: VendaFormProps) {
  const [open, setOpen] = useState(false);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [data, setData] = useState(dataHoje());

  const produtosDisponiveis = produtos.filter((p) => p.estoque > 0);
  const produtoSelecionado = produtos.find((p) => p.id === produtoId);
  const qtd = parseInt(quantidade) || 0;

  const totalVenda = produtoSelecionado ? produtoSelecionado.precoVenda * qtd : 0;
  const lucroEstimado = produtoSelecionado
    ? (produtoSelecionado.precoVenda - produtoSelecionado.precoCompra) * qtd
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoSelecionado || qtd <= 0) return;
    if (qtd > produtoSelecionado.estoque) {
      alert(`Estoque insuficiente! Disponível: ${produtoSelecionado.estoque}`);
      return;
    }

    const venda: Venda = {
      id: gerarId(),
      produtoId: produtoSelecionado.id,
      produtoNome: produtoSelecionado.nome,
      quantidade: qtd,
      precoUnitario: produtoSelecionado.precoVenda,
      precoCompraUnitario: produtoSelecionado.precoCompra,
      total: totalVenda,
      lucro: lucroEstimado,
      data,
      createdAt: new Date().toISOString(),
    };

    const produtoAtualizado: Produto = {
      ...produtoSelecionado,
      estoque: produtoSelecionado.estoque - qtd,
    };

    onVenda(venda, produtoAtualizado);
    setProdutoId('');
    setQuantidade('1');
    setData(dataHoje());
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-green-800/50 rounded-xl text-green-500 hover:text-green-400 hover:border-green-700 transition-all text-sm font-medium"
        disabled={produtosDisponiveis.length === 0}
      >
        <ShoppingCart className="w-4 h-4" />
        {produtosDisponiveis.length === 0 ? 'Sem produtos em estoque' : 'Registrar Venda'}
      </button>
    );
  }

  return (
    <div className="card p-4 border-green-800/30 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-green-400 text-sm flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Registrar Venda
        </h3>
        <button onClick={() => setOpen(false)} className="text-surface-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          className="select-field text-sm"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          required
        >
          <option value="">Selecione o produto</option>
          {produtosDisponiveis.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} — Estoque: {p.estoque} — {formatarMoeda(p.precoVenda)}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-surface-500 mb-1 block">Quantidade</label>
            <input
              type="number"
              min="1"
              max={produtoSelecionado?.estoque ?? 999}
              className="input-field text-sm"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-surface-500 mb-1 block">Data</label>
            <input
              type="date"
              className="input-field text-sm"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
        </div>

        {produtoSelecionado && qtd > 0 && (
          <div className="bg-surface-800/50 rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-surface-400">Total da venda:</span>
              <span className="text-slate-200 text-money font-semibold">{formatarMoeda(totalVenda)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Lucro estimado:</span>
              <span className={`text-money font-semibold ${lucroEstimado >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatarMoeda(lucroEstimado)}
              </span>
            </div>
          </div>
        )}

        <button type="submit" className="w-full btn-primary text-sm py-2.5">
          Confirmar Venda
        </button>
      </form>
    </div>
  );
}
