export interface Avaliacao {
  posicao: number;
  ies: string;
  ies_nome: string;
  uf: string;
  municipio: string;
  rede: "PUBLICA" | "PRIVADA";
  grau: string;
  modalidade: string;
  concluintes_participantes: number;
  nota_fg: number;
  nota_ce: number;
  enade_continuo: number;
  conceito_enade: number;
}

export interface CourseData {
  curso: string;
  ano: number;
  total: number;
  avaliacoes: Avaliacao[];
}

export interface CourseIndexEntry {
  slug: string;
  nome: string;
  ano: number;
  total: number;
}

export type SortField = keyof Avaliacao;
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface Filters {
  uf: string | null;
  rede: string | null;
  faixa: number | null;
  scoreMin: number;
  scoreMax: number;
}
