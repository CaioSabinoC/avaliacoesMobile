import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator,
  Image, ImageBackground,
} from 'react-native';
import { getAvaliacoes, createAvaliacao, updateAvaliacao, deleteAvaliacao } from './api';

function Estrelas({ valor, aoMudar }) {
  return (
    <View style={estilos.fileira}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => aoMudar(n)}>
          <Text style={[estilos.estrela, n <= valor && estilos.estrelaMarcada]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CardAvaliacao({ avaliacao, aoEditar, aoExcluir }) {
  return (
    <View style={estilos.card}>
      <View style={estilos.cardTopo}>
        <Text style={estilos.cardNome}>{avaliacao.nome}</Text>
        <Text style={estilos.cardData}>
          {new Date(avaliacao.happenedAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={estilos.cardTitulo}>{avaliacao.titulo}</Text>
      <View style={estilos.fileira}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Text key={n} style={[estilos.estrelaPequena, n <= avaliacao.estrelas && estilos.estrelaMarcada]}>★</Text>
        ))}
      </View>
      <Text style={estilos.cardDescricao}>{avaliacao.descricao}</Text>
      <View style={estilos.cardAcoes}>
        <TouchableOpacity style={estilos.botaoEditar} onPress={() => aoEditar(avaliacao)}>
          <Text style={estilos.botaoEditarTexto}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botaoExcluir} onPress={() => aoExcluir(avaliacao._id)}>
          <Text style={estilos.botaoExcluirTexto}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando]     = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem]     = useState('');

  const [nome, setNome]           = useState('');
  const [titulo, setTitulo]       = useState('');
  const [descricao, setDescricao] = useState('');
  const [estrelas, setEstrelas]   = useState(0);
  const [data, setData]           = useState('');

  useEffect(() => { buscarAvaliacoes(); }, []);

  async function buscarAvaliacoes() {
    setCarregando(true);
    try {
      setAvaliacoes(await getAvaliacoes());
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setCarregando(false);
    }
  }

  function limparFormulario() {
    setNome(''); setTitulo(''); setDescricao('');
    setEstrelas(0); setData(''); setMensagem('');
    setEditandoId(null);
  }

  function preencherFormulario(avaliacao) {
    setEditandoId(avaliacao._id);
    setNome(avaliacao.nome);
    setTitulo(avaliacao.titulo);
    setDescricao(avaliacao.descricao);
    setEstrelas(avaliacao.estrelas);
    const d = new Date(avaliacao.happenedAt);
    const pad = (n) => String(n).padStart(2, '0');
    setData(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    setMensagem('');
  }

  function confirmarExclusao(id) {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(id) },
    ]);
  }

  async function excluir(id) {
    try {
      await deleteAvaliacao(id);
      await buscarAvaliacoes();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  async function salvar() {
    if (!nome || !titulo || !descricao || !estrelas || !data) {
      setMensagem('Preencha todos os campos.');
      return;
    }
    setSalvando(true);
    try {
      const campos = { nome, titulo, descricao, estrelas, happenedAt: data };
      if (editandoId) {
        await updateAvaliacao(editandoId, campos);
        setMensagem('Avaliação atualizada!');
      } else {
        await createAvaliacao(campos);
        setMensagem('Avaliação salva!');
      }
      await buscarAvaliacoes();
      setTimeout(limparFormulario, 1500);
    } catch (e) {
      setMensagem(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ImageBackground source={require('./assets/fundo.png')} style={estilos.fundo} resizeMode="repeat">
      <StatusBar style="auto" />
      <ScrollView style={estilos.scroll} contentContainerStyle={estilos.conteudo}>

        <View style={estilos.cabecalho}>
          <Image source={require('./assets/logo.png')} style={estilos.logo} resizeMode="contain" />
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>{editandoId ? '✏️ Editar avaliação' : 'Nova avaliação'}</Text>

          <Text style={estilos.rotulo}>Nome do cliente</Text>
          <TextInput style={estilos.campo} value={nome} onChangeText={setNome} placeholder="Nome" />

          <Text style={estilos.rotulo}>Título</Text>
          <TextInput style={estilos.campo} value={titulo} onChangeText={setTitulo} placeholder="Título" />

          <Text style={estilos.rotulo}>Comentário</Text>
          <TextInput style={[estilos.campo, estilos.caixaTexto]} value={descricao} onChangeText={setDescricao} placeholder="Comentário" multiline numberOfLines={4} />

          <Text style={estilos.rotulo}>Nota</Text>
          <Estrelas valor={estrelas} aoMudar={setEstrelas} />

          <Text style={estilos.rotulo}>Data e hora (AAAA-MM-DDTHH:MM)</Text>
          <TextInput style={estilos.campo} value={data} onChangeText={setData} placeholder="2025-01-01T12:00" />

          {!!mensagem && <Text style={estilos.mensagem}>{mensagem}</Text>}

          <View style={estilos.fileiraBotoes}>
            <TouchableOpacity style={[estilos.botaoVermelho, salvando && estilos.botaoDesabilitado]} onPress={salvar} disabled={salvando}>
              <Text style={estilos.botaoVermelhoTexto}>{salvando ? 'Salvando...' : editandoId ? 'Atualizar' : 'Salvar'}</Text>
            </TouchableOpacity>
            {editandoId && (
              <TouchableOpacity style={estilos.botaoCinza} onPress={limparFormulario}>
                <Text style={estilos.botaoCinzaTexto}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Avaliações dos clientes</Text>
          {carregando
            ? <ActivityIndicator size="large" color="#dc2626" style={{ marginTop: 16 }} />
            : avaliacoes.length === 0
              ? <Text style={estilos.vazio}>Nenhuma avaliação ainda.</Text>
              : avaliacoes.map((a) => (
                  <CardAvaliacao key={a._id} avaliacao={a} aoEditar={preencherFormulario} aoExcluir={confirmarExclusao} />
                ))
          }
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  fundo:          { flex: 1 },
  scroll:         { flex: 1, backgroundColor: 'transparent' },
  conteudo:       { padding: 16, paddingTop: 52 },
  cabecalho:      { alignItems: 'center', marginBottom: 20 },
  logo:           { width: 180, height: 180 },
  secao:          { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tituloSecao:    { fontSize: 17, fontWeight: '600', marginBottom: 14 },
  rotulo:         { fontSize: 13, fontWeight: '500', color: '#333', marginBottom: 4 },
  campo:          { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 15 },
  caixaTexto:     { height: 100, textAlignVertical: 'top' },
  fileira:        { flexDirection: 'row', marginBottom: 12 },
  estrela:        { fontSize: 38, color: '#ccc', marginRight: 4 },
  estrelaPequena: { fontSize: 18, color: '#ccc', marginRight: 2 },
  estrelaMarcada: { color: '#ffc107' },
  mensagem:       { color: '#198754', fontWeight: '500', marginBottom: 10 },
  fileiraBotoes:  { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  botaoVermelho:      { backgroundColor: '#dc2626', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  botaoVermelhoTexto: { color: '#fff', fontWeight: '600', fontSize: 15 },
  botaoCinza:         { backgroundColor: '#6c757d', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  botaoCinzaTexto:    { color: '#fff', fontWeight: '600', fontSize: 15 },
  botaoDesabilitado:  { opacity: 0.6 },
  vazio:          { color: '#6c757d', textAlign: 'center', marginTop: 12 },
  card:           { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTopo:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardNome:       { fontWeight: '700', fontSize: 15 },
  cardData:       { color: '#6c757d', fontSize: 12 },
  cardTitulo:     { fontWeight: '600', fontSize: 14, marginBottom: 4 },
  cardDescricao:  { color: '#444', fontSize: 14, lineHeight: 20, marginTop: 4 },
  cardAcoes:          { flexDirection: 'row', gap: 8, marginTop: 12 },
  botaoEditar:        { flex: 1, backgroundColor: '#f0f0f0', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  botaoEditarTexto:   { color: '#333', fontWeight: '600', fontSize: 13 },
  botaoExcluir:       { flex: 1, backgroundColor: '#ffe5e5', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  botaoExcluirTexto:  { color: '#dc2626', fontWeight: '600', fontSize: 13 },
});
