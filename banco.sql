-- =========================================================
-- banco.sql
-- Tabela "livros" — Biblioteca pessoal
-- Campos preenchidos pelo usuário: titulo, autor, ano, paginas, lido
-- =========================================================

-- 1) Criação da tabela
create table if not exists public.livros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text not null,
  ano integer not null,
  paginas integer,
  lido boolean not null default false,
  criado_em timestamp with time zone not null default now()
);

-- 2) Habilita Row Level Security (obrigatório por tabela)
alter table public.livros enable row level security;

-- 3) Políticas — select, insert, update, delete liberadas para o papel anon
--    (mesmo padrão usado no Lab "R", liberando acesso via chave publicável)
create policy "livros_select_anon"
  on public.livros
  for select
  to anon
  using (true);

create policy "livros_insert_anon"
  on public.livros
  for insert
  to anon
  with check (true);

create policy "livros_update_anon"
  on public.livros
  for update
  to anon
  using (true)
  with check (true);

create policy "livros_delete_anon"
  on public.livros
  for delete
  to anon
  using (true);

-- 4) Registros de exemplo (mínimo de 3, conforme exigido)
insert into public.livros (titulo, autor, ano, paginas, lido) values
  ('Dom Casmurro', 'Machado de Assis', 1899, 256, true),
  ('1984', 'George Orwell', 1949, 328, true),
  ('O Hobbit', 'J.R.R. Tolkien', 1937, 310, false);

-- =========================================================
-- Teste rápido pelo navegador (depois de rodar este script):
-- https://SEU_PROJETO.supabase.co/rest/v1/livros?select=*&apikey=SUA_CHAVE_PUBLICAVEL
-- =========================================================