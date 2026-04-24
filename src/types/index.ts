// ========================
// FINANCAS PESSOAIS
// ========================
export interface Entrada {
  id: string;
  descricao: string;
  valor: number;
  data: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface Saida {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: CategoriaGasto;
  createdAt: string;
}

export type CategoriaGasto =
  | 'Aluguel'
  | 'Luz'
  | 'Água'
  | 'Condomínio'
  | 'Internet'
  | 'Gás'
  | 'Comida'
  | 'Gasolina'
  | 'Saúde'
  | 'Educação'
  | 'Lazer'
  | 'Roupas'
  | 'Transporte'
  | 'Outros';

export const CATEGORIAS: CategoriaGasto[] = [
  'Aluguel',
  'Luz',
  'Água',
  'Condomínio',
  'Internet',
  'Gás',
  'Comida',
  'Gasolina',
  'Saúde',
  'Educação',
  'Lazer',
  'Roupas',
  'Transporte',
  'Outros',
];

// ========================
// EMPRESA
// ========================
export interface Produto {
  id: string;
  nome: string;
  precoCompra: number;
  precoVenda: number;
  estoque: number;
  createdAt: string;
}

export interface Venda {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  precoCompraUnitario: number;
  total: number;
  lucro: number;
  data: string;
  createdAt: string;
}

// ========================
// LEMBRETES
// ========================
export type TipoLembrete = 'pagar' | 'receber';

export interface Lembrete {
  id: string;
  descricao: string;
  dataVencimento: string;
  tipo: TipoLembrete;
  valor: number;
  pago: boolean;
  pagoEm?: string;
  createdAt: string;
}

// ========================
// APP STATE
// ========================
export type AbaAtiva = 'financas' | 'empresa' | 'lembretes';

export interface AppData {
  entradas: Entrada[];
  saidas: Saida[];
  produtos: Produto[];
  vendas: Venda[];
  lembretes: Lembrete[];
  exportedAt?: string;
}
