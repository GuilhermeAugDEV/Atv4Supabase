# 📚 Minha Biblioteca — CRUD com Expo + Supabase

App React Native (Expo, template Blank TypeScript) que faz Create, Read,
Update e Delete na tabela `livros` de um projeto Supabase (PostgreSQL).

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
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```
⚠️ Use apenas a chave **publicável** (`sb_publishable_...`). Nunca coloque a
chave secreta (`sb_secret_...`) no projeto.

### 3. Rodar no Expo Go
```bash
npx expo start
```
Escaneie o QR code com o app Expo Go no celular (ou rode num emulador).