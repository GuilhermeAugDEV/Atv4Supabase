import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Switch,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from './lib/supabase';
import { Livro, LivroForm, formVazio } from './types/Livro';

export default function App() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState('');

  const [form, setForm] = useState<LivroForm>(formVazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  // ---------- READ ----------
  const buscarLivros = useCallback(async (termo: string) => {
    setCarregando(true);
    let query = supabase
      .from('livros')
      .select('*')
      .order('criado_em', { ascending: false });

    if (termo.trim().length > 0) {
      query = query.ilike('titulo', `%${termo.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      Alert.alert('Erro ao carregar', error.message);
    } else {
      setLivros(data as Livro[]);
    }
    setCarregando(false);
    setAtualizando(false);
  }, []);

  useEffect(() => {
    buscarLivros(busca);
  }, [busca, buscarLivros]);

  const onRefresh = () => {
    setAtualizando(true);
    buscarLivros(busca);
  };

  // ---------- VALIDAÇÃO ----------
  const validar = (): string | null => {
    if (!form.titulo.trim()) return 'Informe o título.';
    if (!form.autor.trim()) return 'Informe o autor.';
    if (!form.ano.trim()) return 'Informe o ano.';
    if (!/^\d+$/.test(form.ano.trim())) return 'Ano deve conter apenas números.';
    if (form.paginas.trim() && !/^\d+$/.test(form.paginas.trim())) {
      return 'Páginas deve conter apenas números.';
    }
    return null;
  };

  // ---------- CREATE / UPDATE ----------
  const salvar = async () => {
    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }
    setErro('');

    const payload = {
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      ano: parseInt(form.ano, 10),
      paginas: form.paginas.trim() ? parseInt(form.paginas, 10) : null,
      lido: form.lido,
    };

    if (editandoId) {
      const { error } = await supabase
        .from('livros')
        .update(payload)
        .eq('id', editandoId);

      if (error) {
        Alert.alert('Erro ao atualizar', error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('livros').insert(payload);

      if (error) {
        Alert.alert('Erro ao inserir', error.message);
        return;
      }
    }

    cancelarEdicao();
    buscarLivros(busca);
  };

  const iniciarEdicao = (livro: Livro) => {
    setEditandoId(livro.id);
    setForm({
      titulo: livro.titulo,
      autor: livro.autor,
      ano: String(livro.ano),
      paginas: livro.paginas !== null ? String(livro.paginas) : '',
      lido: livro.lido,
    });
    setErro('');
    setMostrarForm(true);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(formVazio);
    setErro('');
    setMostrarForm(false);
  };

  // ---------- DELETE ----------
  const confirmarExclusao = (livro: Livro) => {
    Alert.alert(
      'Excluir livro',
      `Tem certeza que deseja excluir "${livro.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluir(livro.id),
        },
      ]
    );
  };

  const excluir = async (id: string) => {
    const { error } = await supabase.from('livros').delete().eq('id', id);
    if (error) {
      Alert.alert('Erro ao excluir', error.message);
      return;
    }
    if (editandoId === id) cancelarEdicao();
    buscarLivros(busca);
  };

  // ---------- UI ----------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Text style={styles.titulo}>Minha Biblioteca</Text>

        {/* Busca */}
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por título..."
          value={busca}
          onChangeText={setBusca}
        />

        {/* Formulário como modal centralizado */}
        {(mostrarForm || editandoId) && (
          <View style={styles.modalOverlay} pointerEvents="box-none">
            <TouchableWithoutFeedback
              onPress={() => {
                if (editandoId) cancelarEdicao();
                else setMostrarForm(false);
              }}
            >
              <View style={styles.modalBackground} />
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContainer}
            >
              <View style={[styles.form, styles.formModal]}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => {
                    if (editandoId) cancelarEdicao();
                    else setMostrarForm(false);
                  }}
                  accessibilityLabel="Fechar formulário"
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.formTitulo}>
                  {editandoId ? 'Editar livro' : 'Novo livro'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Título *"
                  value={form.titulo}
                  onChangeText={(v) => setForm({ ...form, titulo: v })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Autor *"
                  value={form.autor}
                  onChangeText={(v) => setForm({ ...form, autor: v })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ano *"
                  keyboardType="numeric"
                  value={form.ano}
                  onChangeText={(v) => setForm({ ...form, ano: v })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Páginas"
                  keyboardType="numeric"
                  value={form.paginas}
                  onChangeText={(v) => setForm({ ...form, paginas: v })}
                />

                <View style={styles.linhaSwitch}>
                  <Text>Já li este livro</Text>
                  <Switch
                    value={form.lido}
                    onValueChange={(v) => setForm({ ...form, lido: v })}
                  />
                </View>

                {erro ? <Text style={styles.erro}>{erro}</Text> : null}

                <View style={styles.linhaBotoes}>
                  <TouchableOpacity style={styles.botaoPrimario} onPress={salvar}>
                    <Text style={styles.textoBotao}>
                      {editandoId ? 'Salvar alterações' : 'Adicionar'}
                    </Text>
                  </TouchableOpacity>

                  {editandoId && (
                    <TouchableOpacity
                      style={styles.botaoSecundario}
                      onPress={cancelarEdicao}
                    >
                      <Text style={styles.textoBotaoSecundario}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}

        

        {/* Lista */}
        <FlatList
          style={{ flex: 1 }}
          data={livros}
          keyExtractor={(item) => item.id}
          refreshing={atualizando}
          onRefresh={onRefresh}
          ListEmptyComponent={
            !carregando ? (
              <Text style={styles.vazio}>Nenhum livro encontrado.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardSub}>
                  {item.autor} • {item.ano}
                  {item.paginas ? ` • ${item.paginas} pág.` : ''}
                </Text>
                <Text style={styles.cardStatus}>
                  {item.lido ? '✅ Lido' : '📖 Não lido'}
                </Text>
              </View>
              <View style={styles.acoes}>
                <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                  <Text style={styles.linkEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmarExclusao(item)}>
                  <Text style={styles.linkExcluir}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {!mostrarForm && !editandoId && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setMostrarForm(true)}
            accessibilityLabel="Abrir formulário"
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f5f2', paddingHorizontal: 16 },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  inputBusca: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  formTitulo: { fontWeight: '700', marginBottom: 8, fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  erro: { color: '#c0392b', marginBottom: 8 },
  linhaBotoes: { flexDirection: 'row', gap: 10 },
  botaoPrimario: {
    backgroundColor: '#1a7a9c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotao: { color: '#fff', fontWeight: '600' },
  botaoSecundario: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textoBotaoSecundario: { color: '#555', fontWeight: '600' },
  vazio: { textAlign: 'center', marginTop: 24, color: '#888' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitulo: { fontWeight: '700', fontSize: 15 },
  cardSub: { color: '#666', marginTop: 2 },
  cardStatus: { marginTop: 4, fontSize: 12 },
  acoes: { alignItems: 'flex-end', gap: 6 },
  linkEditar: { color: '#1a7a9c', fontWeight: '600' },
  linkExcluir: { color: '#c0392b', fontWeight: '600', marginTop: 6 },
  fab: {
    position: 'absolute',
    right: 150,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#09810f',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 1000,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: '700' },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    zIndex: 10,
  },
  closeText: { fontSize: 18, color: '#666', fontWeight: '700' },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -16,
    right: -16,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formModal: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 16,
  },
});
