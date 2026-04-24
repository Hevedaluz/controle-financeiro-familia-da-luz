import { useState } from 'react';
import {
  Package, ShoppingCart, TrendingUp, Trash2, Edit3, Check, X,
  BarChart2, AlertTriangle
} from 'lucide-react';
import { Produto, Venda } from '../../types';
import { formatarMoeda, formatarData, getMesAtual, formatarMesAno } from '../../utils/helpers';
import ProdutoForm from './ProdutoForm';
import VendaForm from './VendaForm';

interface EmpresaDashboardProps {
  produtos: Produto[];
  vendas: Venda[];
  onAddProduto: (p: Produto) => void;
  onUpdateProduto: (p: Produto) => void;
  onRemoveProduto: (id: string) => void;
  onAddVenda: (v: Venda, produtoAtualizado: Produto) => void;
  onRemoveVenda: (id: string, produtoId: string, quantidade: number) => void;
}

export default function EmpresaDashboard({
  produtos, vendas, onAddProduto, onUpdateProduto, onRemoveProduto, onAddVenda, onRemoveVenda
}: EmpresaDashboardProps) {
  const atual = getMesAtual();
  const [subAba, setSubAba] = useState<'estoque' | 'vendas' | 'relatorio'>('estoque');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editEstoque, setEditEstoque] = useState('');

  // Vendas do mês atual para relatório
  const vendasMes = vendas.filter((v) => {
    const d = new Date(v.data);
    return d.getMonth() + 1 === atual.mes && d.getFullYear() === atual.ano;
  });

  const totalVendidoMes = vendasMes.reduce((sum, v) => sum + v.total, 0);
  const totalCompradoMes = vendasMes.reduce((sum, v) => sum + v.precoCompraUnitario * v.quantidade, 0);
  const lucroLiquidoMes = vendasMes.reduce((sum, v) => sum + v.lucro, 0);

  // Total histórico
  const lucroTotal = vendas.reduce((sum, v) => sum + v.lucro, 0);
  const totalVendidoHistorico = vendas.reduce((sum, v) => sum + v.total, 0);

  const salvarEstoque = (produto: Produto) => {
    const novoEstoque = parseInt(editEstoque);
    if (isNaN(novoEstoque) || novoEstoque < 0) return;
    onUpdateProduto({ ...produto, estoque: novoEstoque });
    setEditandoId(null);
  };

  const produtosEstoqueBaixo = produtos.filter((p) => p.estoque <= 2);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Cards resumo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card-blue">
          <p className="text-surface-400 text-xs mb-2 uppercase tracking-wide">Produtos</p>
          <p className="text-2xl font-bold text-blue-400">{produtos.length}</p>
        </div>
        <div className="stat-card-green">
          <p className="text-surface-400 text-xs mb-2 uppercase tracking-wide">Vendas (mês)</p>
          <p className="text-2xl font-bold gradient-text-green">{vendasMes.length}</p>
        </div>
        <div className="stat-card-green">
          <p className="text-surface-400 text-xs mb-2 uppercase tracking-wide">Receita (mês)</p>
          <p className="text-lg font-bold gradient-text-green text-money">{formatarMoeda(totalVendidoMes)}</p>
        </div>
        <div className={lucroLiquidoMes >= 0 ? 'stat-card-green' : 'stat-card-red'}>
          <p className="text-surface-400 text-xs mb-2 uppercase tracking-wide">Lucro (mês)</p>
          <p className={`text-lg font-bold text-money ${lucroLiquidoMes >= 0 ? 'gradient-text-green' : 'gradient-text-red'}`}>
            {formatarMoeda(lucroLiquidoMes)}
          </p>
        </div>
      </div>

      {/* Alerta estoque baixo */}
      {produtosEstoqueBaixo.length > 0 && (
        <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-800/40 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-xs font-semibold">Estoque baixo</p>
            <p className="text-yellow-500/80 text-xs">
              {produtosEstoqueBaixo.map((p) => `${p.nome} (${p.estoque})`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Sub-navegação */}
      <div className="flex gap-1 bg-surface-900 p-1 rounded-xl border border-surface-800">
        {[
          { id: 'estoque', label: 'Estoque', icon: Package },
          { id: 'vendas', label: `Vendas (${vendas.length})`, icon: ShoppingCart },
          { id: 'relatorio', label: 'Relatório', icon: BarChart2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSubAba(item.id as typeof subAba)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                subAba === item.id ? 'bg-surface-700 text-slate-100' : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 hidden sm:block" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Estoque */}
      {subAba === 'estoque' && (
        <div className="space-y-3 animate-fade-in">
          <ProdutoForm onAdd={onAddProduto} />

          {produtos.length === 0 ? (
            <div className="text-center py-8 text-surface-500 text-sm">
              Nenhum produto cadastrado
            </div>
          ) : (
            <div className="space-y-2">
              {produtos.map((produto) => {
                const margem = produto.precoCompra > 0
                  ? ((produto.precoVenda - produto.precoCompra) / produto.precoCompra * 100).toFixed(0)
                  : '0';
                return (
                  <div key={produto.id} className="card p-3.5 hover:border-surface-600/60 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 text-sm truncate">{produto.nome}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-xs text-surface-500">
                            Compra: <span className="text-slate-300 text-money">{formatarMoeda(produto.precoCompra)}</span>
                          </span>
                          <span className="text-xs text-surface-500">
                            Venda: <span className="text-green-400 text-money">{formatarMoeda(produto.precoVenda)}</span>
                          </span>
                          <span className={`text-xs font-medium ${parseFloat(margem) >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                            Margem: {margem}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Estoque editável */}
                        <div className="flex items-center gap-1">
                          {editandoId === produto.id ? (
                            <>
                              <input
                                type="number"
                                min="0"
                                className="w-16 text-center bg-surface-700 border border-surface-600 rounded-lg text-sm text-slate-100 py-1 px-2"
                                value={editEstoque}
                                onChange={(e) => setEditEstoque(e.target.value)}
                                autoFocus
                              />
                              <button onClick={() => salvarEstoque(produto)} className="text-green-400 hover:text-green-300 p-1">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditandoId(null)} className="text-surface-500 hover:text-slate-300 p-1">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className={`text-sm font-bold text-money px-2 py-1 rounded-lg ${
                                produto.estoque === 0 ? 'bg-red-900/40 text-red-400'
                                : produto.estoque <= 2 ? 'bg-yellow-900/40 text-yellow-400'
                                : 'bg-green-900/40 text-green-400'
                              }`}>
                                {produto.estoque}
                              </span>
                              <button
                                onClick={() => { setEditandoId(produto.id); setEditEstoque(String(produto.estoque)); }}
                                className="text-surface-600 hover:text-slate-300 p-1"
                                title="Editar estoque"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => onRemoveProduto(produto.id)}
                          className="text-surface-600 hover:text-red-400 p-1 transition-all"
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
      )}

      {/* Vendas */}
      {subAba === 'vendas' && (
        <div className="space-y-3 animate-fade-in">
          <VendaForm produtos={produtos} onVenda={onAddVenda} />

          {vendas.length === 0 ? (
            <div className="text-center py-8 text-surface-500 text-sm">
              Nenhuma venda registrada
            </div>
          ) : (
            <div className="space-y-2">
              {[...vendas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map((venda) => (
                <div key={venda.id} className="card p-3.5 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-900/40 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-200">{venda.produtoNome}</p>
                        <p className="text-xs text-surface-500 mt-0.5">
                          {venda.quantidade}x {formatarMoeda(venda.precoUnitario)} · {formatarData(venda.data)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-400 text-money">{formatarMoeda(venda.total)}</p>
                        <p className={`text-xs text-money ${venda.lucro >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                          lucro: {formatarMoeda(venda.lucro)}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveVenda(venda.id, venda.produtoId, venda.quantidade)}
                        className="opacity-0 group-hover:opacity-100 text-surface-600 hover:text-red-400 p-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Relatório */}
      {subAba === 'relatorio' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              <h3 className="font-semibold text-slate-200 text-sm">
                Relatório — {formatarMesAno(atual.ano, atual.mes)}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-surface-800">
                <span className="text-surface-400 text-sm">Total de vendas</span>
                <span className="text-slate-200 font-medium text-sm">{vendasMes.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-800">
                <span className="text-surface-400 text-sm">Receita bruta</span>
                <span className="text-green-400 font-semibold text-money text-sm">{formatarMoeda(totalVendidoMes)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-800">
                <span className="text-surface-400 text-sm">Custo das mercadorias</span>
                <span className="text-yellow-400 font-semibold text-money text-sm">{formatarMoeda(totalCompradoMes)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-200 font-semibold text-sm">Lucro líquido</span>
                <span className={`font-bold text-money text-sm ${lucroLiquidoMes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatarMoeda(lucroLiquidoMes)}
                </span>
              </div>
            </div>
          </div>

          {/* Resumo histórico */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Resumo Histórico Total</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-surface-800">
                <span className="text-surface-400 text-sm">Total vendido</span>
                <span className="text-green-400 font-semibold text-money text-sm">{formatarMoeda(totalVendidoHistorico)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-200 font-semibold text-sm">Lucro total acumulado</span>
                <span className={`font-bold text-money text-sm ${lucroTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatarMoeda(lucroTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Lucro por produto */}
          {produtos.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4">Lucro por Produto</h3>
              <div className="space-y-2">
                {produtos.map((produto) => {
                  const vendasProduto = vendas.filter((v) => v.produtoId === produto.id);
                  const lucroProduto = vendasProduto.reduce((sum, v) => sum + v.lucro, 0);
                  const qtdVendida = vendasProduto.reduce((sum, v) => sum + v.quantidade, 0);
                  return (
                    <div key={produto.id} className="flex items-center justify-between py-2 border-b border-surface-800/50 last:border-0">
                      <div>
                        <p className="text-sm text-slate-300">{produto.nome}</p>
                        <p className="text-xs text-surface-500">{qtdVendida} unidades vendidas</p>
                      </div>
                      <span className={`text-sm font-semibold text-money ${lucroProduto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatarMoeda(lucroProduto)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
