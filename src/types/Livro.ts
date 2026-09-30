export type Livro = {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  paginas: number | null;
  lido: boolean;
  criado_em: string;
};

// Campos que o formulário preenche (sem id e criado_em, gerados pelo banco)
export type LivroForm = {
  titulo: string;
  autor: string;
  ano: string; // string no formulário, convertido para number antes de enviar
  paginas: string; // idem
  lido: boolean;
};

export const formVazio: LivroForm = {
  titulo: '',
  autor: '',
  ano: '',
  paginas: '',
  lido: false,
};
