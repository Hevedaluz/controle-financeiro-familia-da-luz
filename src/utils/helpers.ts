import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatarData(dataStr: string): string {
  try {
    const date = parseISO(dataStr);
    if (!isValid(date)) return dataStr;
    return format(date, "dd 'de' MMM", { locale: ptBR });
  } catch {
    return dataStr;
  }
}

export function formatarDataCompleta(dataStr: string): string {
  try {
    const date = parseISO(dataStr);
    if (!isValid(date)) return dataStr;
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dataStr;
  }
}

export function formatarMesAno(ano: number, mes: number): string {
  const date = new Date(ano, mes - 1, 1);
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

export function getMesAtual(): { mes: number; ano: number } {
  const now = new Date();
  return { mes: now.getMonth() + 1, ano: now.getFullYear() };
}

export function dataHoje(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function diferencaDias(dataStr: string): number {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = parseISO(dataStr);
    data.setHours(0, 0, 0, 0);
    const diff = (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return Math.round(diff);
  } catch {
    return 0;
  }
}

export function getMesesAnteriores(quantidade: number): Array<{ mes: number; ano: number; label: string }> {
  const resultado = [];
  const now = new Date();
  for (let i = quantidade - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    resultado.push({
      mes: date.getMonth() + 1,
      ano: date.getFullYear(),
      label: format(date, 'MMM/yy', { locale: ptBR }),
    });
  }
  return resultado;
}

export function capitalizar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncar(str: string, max: number): string {
  return str.length > max ? str.substring(0, max) + '…' : str;
}
