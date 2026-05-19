import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator,
  Image, ImageBackground,
} from 'react-native';
import { getAvaliacoes, createAvaliacao } from './api';

function StarRating({ value, onChange }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onChange(s)}>
          <Text style={[styles.star, s <= value && styles.starOn]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardName}>{review.nome}</Text>
        <Text style={styles.cardDate}>
          {new Date(review.happenedAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{review.titulo}</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Text key={s} style={[styles.starSm, s <= review.estrelas && styles.starOn]}>★</Text>
        ))}
      </View>
      <Text style={styles.cardDesc}>{review.descricao}</Text>
    </View>
  );
}

export default function App() {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [nome, setNome]             = useState('');
  const [titulo, setTitulo]         = useState('');
  const [descricao, setDescricao]   = useState('');
  const [estrelas, setEstrelas]     = useState(0);
  const [happenedAt, setHappenedAt] = useState('');
  const [message, setMessage]       = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const data = await getAvaliacoes();
      setReviews(data);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setNome(''); setTitulo(''); setDescricao('');
    setEstrelas(0); setHappenedAt(''); setMessage('');
  }

  async function handleSubmit() {
    if (!nome || !titulo || !descricao || !estrelas || !happenedAt) {
      setMessage('Preencha todos os campos.');
      return;
    }

    setSaving(true);
    try {
      await createAvaliacao({ nome, titulo, descricao, estrelas, happenedAt });
      setMessage('Avaliação salva!');
      await fetchReviews();
      setTimeout(resetForm, 1500);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ImageBackground
      source={require('./assets/fundo.png')}
      style={styles.bgImage}
      resizeMode="repeat"
    >
      <StatusBar style="auto" />
      <ScrollView style={styles.bg} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Nova avaliação
          </Text>

          <Text style={styles.label}>Nome do cliente</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />

          <Text style={styles.label}>Título da avaliação</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" />

          <Text style={styles.label}>Comentário</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={descricao} onChangeText={setDescricao}
            placeholder="Comentário" multiline numberOfLines={4}
          />

          <Text style={styles.label}>Avaliação</Text>
          <StarRating value={estrelas} onChange={setEstrelas} />

          <Text style={styles.label}>Data e hora (AAAA-MM-DDTHH:MM)</Text>
          <TextInput
            style={styles.input}
            value={happenedAt} onChangeText={setHappenedAt}
            placeholder="2025-01-01T12:00"
          />

          {!!message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btnRed, saving && styles.btnDisabled]} onPress={handleSubmit} disabled={saving}>
              <Text style={styles.btnRedText}>{saving ? 'Salvando...' : 'Salvar avaliação'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações dos clientes</Text>

          {loading
            ? <ActivityIndicator size="large" color="#dc2626" style={{ marginTop: 16 }} />
            : reviews.length === 0
              ? <Text style={styles.empty}>Nenhuma avaliação ainda.</Text>
              : reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} />
                ))
          }
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  bg:      { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 52 },

  header:    { alignItems: 'center', marginBottom: 20 },
  logo:      { width: 180, height: 180 },

  section: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 14 },

  label: { fontSize: 13, fontWeight: '500', color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8,
    padding: 10, marginBottom: 12, fontSize: 15,
  },
  textarea: { height: 100, textAlignVertical: 'top' },

  starRow: { flexDirection: 'row', marginBottom: 12 },
  star:    { fontSize: 38, color: '#ccc', marginRight: 4 },
  starSm:  { fontSize: 18, color: '#ccc', marginRight: 2 },
  starOn:  { color: '#ffc107' },

  message: { color: '#198754', fontWeight: '500', marginBottom: 10 },

  btnRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btnRed:      { backgroundColor: '#dc2626', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  btnRedText:  { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnGray:     { backgroundColor: '#6c757d', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  btnGrayText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnDisabled: { opacity: 0.6 },

  empty: { color: '#6c757d', textAlign: 'center', marginTop: 12 },

  card:        { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardName:    { fontWeight: '700', fontSize: 15 },
  cardDate:    { color: '#6c757d', fontSize: 12 },
  cardTitle:   { fontWeight: '600', fontSize: 14, marginBottom: 4 },
  cardDesc:    { color: '#444', fontSize: 14, lineHeight: 20, marginTop: 4 },
});
