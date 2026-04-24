import { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Entrada, Saida, Produto, Venda, Lembrete, AbaAtiva, AppData } from './types';
import { diferencaDias } from './utils/helpers';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FinancasDashboard from './components/financas/FinancasDashboard';
import EmpresaDashboard from './components/empresa/EmpresaDashboard';
import LembretesDashboard from './components/lembretes/LembretesDashboard';

export default function App() {
  const [splashVisto, setSplashVisto] = useLocalStorage<boolean>('cf_splash_visto', false);
  const [mostrarSplash, setMostrarSplash] = useState(!splashVisto);
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('financas');

  // Dados persistidos
  const [entradas, setEntradas] = useLocalStorage<Entrada[]>('cf_entradas', []);
  const [saidas, setSaidas] = useLocalStorage<Saida[]>('cf_saidas', []);
  const [produtos, setProdutos] = useLocalStorage<Produto[]>('cf_produtos', []);
  const [vendas, setVendas] = useLocalStorage<Venda[]>('cf_vendas', []);
  const [lembretes, setLembretes] = useLocalStorage<Lembrete[]>('cf_lembretes', []);

  const handleCloseSplash = () => {
    setMostrarSplash(false);
    setSplashVisto(true);
  };

  // Lembretes vencidos/pendentes para notificação
  const lembretesPendentes = lembretes.filter(
    (l) => !l.pago && diferencaDias(l.dataVencimento) <= 0
  ).length;

  // ============================
  // FINANCAS
  // ============================
  const addEntrada = useCallback((e: Entrada) => {
    setEntradas((prev) => [e, ...prev]);
  }, [setEntradas]);

  const removeEntrada = useCallback((id: string) => {
    setEntradas((prev) => prev.filter((e) => e.id !== id));
  }, [setEntradas]);

  const addSaida = useCallback((s: Saida) => {
    setSaidas((prev) => [s, ...prev]);
  }, [setSaidas]);

  const removeSaida = useCallback((id: string) => {
    setSaidas((prev) => prev.filter((s) => s.id !== id));
  }, [setSaidas]);

  // ============================
  // EMPRESA
  // ============================
  const addProduto = useCallback((p: Produto) => {
    setProdutos((prev) => [...prev, p]);
  }, [setProdutos]);

  const updateProduto = useCallback((p: Produto) => {
    setProdutos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, [setProdutos]);

  const removeProduto = useCallback((id: string) => {
    const confirmar = window.confirm('Remover este produto? As vendas associadas serão mantidas.');
    if (!confirmar) return;
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }, [setProdutos]);

  const addVenda = useCallback((v: Venda, produtoAtualizado: Produto) => {
    setVendas((prev) => [v, ...prev]);
    setProdutos((prev) => prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p)));
  }, [setVendas, setProdutos]);

  const removeVenda = useCallback((id: string, produtoId: string, quantidade: number) => {
    setVendas((prev) => prev.filter((v) => v.id !== id));
    // Devolver ao estoque
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produtoId ? { ...p, estoque: p.estoque + quantidade } : p
      )
    );
  }, [setVendas, setProdutos]);

  // ============================
  // LEMBRETES
  // ============================
  const addLembrete = useCallback((l: Lembrete) => {
    setLembretes((prev) => [...prev, l]);
  }, [setLembretes]);

  const togglePagoLembrete = useCallback((id: string) => {
    setLembretes((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, pago: !l.pago, pagoEm: !l.pago ? new Date().toISOString().slice(0, 10) : undefined }
          : l
      )
    );
  }, [setLembretes]);

  const removeLembrete = useCallback((id: string) => {
    setLembretes((prev) => prev.filter((l) => l.id !== id));
  }, [setLembretes]);

  // ============================
  // BACKUP
  // ============================
  const exportarDados = () => {
    const data: AppData = {
      entradas,
      saidas,
      produtos,
      vendas,
      lembretes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `controle-financeiro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarDados = (data: AppData) => {
    if (data.entradas) setEntradas(data.entradas);
    if (data.saidas) setSaidas(data.saidas);
    if (data.produtos) setProdutos(data.produtos);
    if (data.vendas) setVendas(data.vendas);
    if (data.lembretes) setLembretes(data.lembretes);
  };

  return (
    <>
      {mostrarSplash && <SplashScreen onClose={handleCloseSplash} />}

      <div className="min-h-dvh bg-surface-950 flex flex-col">
        <Header
          onExport={exportarDados}
          onImport={importarDados}
          lembretesPendentes={lembretesPendentes}
        />

        <div className="flex flex-1">
          <Navigation
            abaAtiva={abaAtiva}
            onChange={setAbaAtiva}
            lembretesPendentes={lembretesPendentes}
          />

          {/* Conteúdo principal */}
          <main className="flex-1 lg:ml-56 pb-20 lg:pb-6">
            <div className="max-w-3xl mx-auto px-4 py-5">
              {abaAtiva === 'financas' && (
                <FinancasDashboard
                  entradas={entradas}
                  saidas={saidas}
                  onAddEntrada={addEntrada}
                  onAddSaida={addSaida}
                  onRemoveEntrada={removeEntrada}
                  onRemoveSaida={removeSaida}
                />
              )}

              {abaAtiva === 'empresa' && (
                <EmpresaDashboard
                  produtos={produtos}
                  vendas={vendas}
                  onAddProduto={addProduto}
                  onUpdateProduto={updateProduto}
                  onRemoveProduto={removeProduto}
                  onAddVenda={addVenda}
                  onRemoveVenda={removeVenda}
                />
              )}

              {abaAtiva === 'lembretes' && (
                <LembretesDashboard
                  lembretes={lembretes}
                  onAdd={addLembrete}
                  onTogglePago={togglePagoLembrete}
                  onRemove={removeLembrete}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
