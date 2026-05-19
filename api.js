const BASE_URL = 'https://backend-avaliacoes-iimr.onrender.com/api/avaliacoes';

export async function getAvaliacoes() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Erro ao buscar avaliações');
  return res.json();
}

export async function createAvaliacao(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar avaliação');
  return res.json();
}

export async function updateAvaliacao(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar avaliação');
  return res.json();
}

export async function deleteAvaliacao(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir avaliação');
  return res.json();
}
