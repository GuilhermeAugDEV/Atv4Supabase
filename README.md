# 📚 Minha Biblioteca — CRUD com Expo + Supabase

App React Native (Expo, template Blank TypeScript) que faz Create, Read,
Update e Delete na tabela `livros` de um projeto Supabase (PostgreSQL).

## Estrutura entregue neste pacote
```
livros-app/
├── App.tsx               # Ponto de entrada exigido pelo Expo (só reexporta src/App.tsx)
├── src/
│   ├── App.tsx            # Tela única com o CRUD completo
│   ├── lib/
│   │   └── supabase.ts    # Cliente Supabase (lê variáveis do .env)
│   └── types/
│       └── Livro.ts        # Type que espelha a tabela do banco
├── banco.sql              # SQL: criação da tabela + políticas RLS + inserts
└── README.md
```

Este pacote contém apenas o código-fonte do app (não o projeto Expo completo,
que inclui `node_modules`, `package.json`, `app.json` etc., gerados pelo CLI).
Siga os passos abaixo para montar o projeto Expo de verdade e copiar estes
arquivos para dentro dele.

## Passo a passo

### 1. Criar o projeto Expo
```bash
npx create-expo-app@latest livros-app --template blank-typescript
cd livros-app
```

### 2. Instalar as dependências do Supabase
```bash
npx expo install @supabase/supabase-js react-native-url-polyfill
```

### 3. Copiar os arquivos deste pacote para dentro do projeto
Copie `App.tsx` (substituindo o gerado pelo Expo), a pasta `src/` inteira,
o `banco.sql`, o `.env.example` e o `.gitignore` para a raiz do projeto
criado no passo 1. O `App.tsx` da raiz só reexporta `src/App.tsx` — é o
que o Expo espera encontrar por padrão.

### 4. Criar a tabela no Supabase
No **SQL Editor** do seu projeto Supabase, rode o conteúdo de `banco.sql`
(criação da tabela `livros`, as 4 políticas de RLS e os 3 registros de
exemplo).

Teste a API pelo navegador antes de seguir:
```
https://SEU_PROJETO.supabase.co/rest/v1/livros?select=*&apikey=SUA_CHAVE_PUBLICAVEL
```
Deve retornar os 3 livros inseridos.

### 5. Configurar o `.env`
Copie `.env.example` para `.env` e preencha com os dados do seu projeto
(Project Settings → API no painel do Supabase):
```
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```
⚠️ Use apenas a chave **publicável** (`sb_publishable_...`). Nunca coloque a
chave secreta (`sb_secret_...`) no projeto.

### 6. Rodar no Expo Go
```bash
npx expo start
```
Escaneie o QR code com o app Expo Go no celular (ou rode num emulador).

### 7. Testar o CRUD
- **Create**: preencha título, autor e ano (obrigatórios) e toque em
  "Adicionar". Campos vazios ou ano/páginas com texto são bloqueados antes do
  envio.
- **Read**: a lista carrega automaticamente e reflete o banco após cada
  operação. Puxe a lista para baixo para atualizar manualmente.
- **Update**: toque em "Editar" num item — o formulário é preenchido com os
  dados atuais; ajuste e toque em "Salvar alterações".
- **Delete**: toque em "Excluir" — um `Alert` pede confirmação antes de
  remover.
- **Bônus**: use o campo de busca (filtra por título com `ilike`) e o
  `Switch` de "Já li este livro".

## Publicar no GitHub sem expor credenciais
```bash
git init
git add .
git status   # confirme que .env NÃO aparece na lista, só .env.example
git commit -m "CRUD Expo + Supabase - Minha Biblioteca"
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

## Antes da entrega
- Confirme no painel do Supabase que o projeto está **ativo** (não pausado
  por inatividade) até a correção.
- Anexe no SIGAA a URL do projeto + a chave publicável (ou o próprio `.env`)
  e o link do repositório.
