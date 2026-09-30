import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env
  .EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam as variáveis EXPO_PUBLIC_SUPABASE_URL e/ou ' +
      'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY no arquivo .env'
  );
}

// Usa SOMENTE a chave publicável (sb_publishable_...).
// A chave secreta (sb_secret_...) nunca deve aparecer no app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
