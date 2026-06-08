# Avaliacoes Mobile

App mobile para cadastro e gerenciamento de avaliacoes de clientes, desenvolvido com React Native e Expo.

## Tecnologias

- [React Native 0.81.5](https://reactnative.dev/)
- [Expo 54](https://expo.dev/)
- Backend REST em Node.js hospedado no [Render](https://render.com/)

## Funcionalidades

- Listar avaliacoes dos clientes
- Cadastrar nova avaliacao
- Editar avaliacao existente
- Excluir avaliacao com confirmacao
- Avaliacao por estrelas (1 a 5)

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [Expo Go](https://expo.dev/go) instalado no celular, ou emulador Android/iOS

## Como rodar

```bash
# Instalar dependencias
npm install

# Iniciar o projeto
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou com a camera (iOS).

## Estrutura
App.js       # Tela principal com formulario e lista
api.js       # Funcoes de comunicacao com o backend
assets/      # Logo e imagem de fundo

## Backend

A API esta em: https://backend-avaliacoes-iimr.onrender.com/api/avaliacoes

| Metodo | Rota                  | Descricao          |
|--------|-----------------------|--------------------|
| GET    | /api/avaliacoes       | Listar avaliacoes  |
| POST   | /api/avaliacoes       | Criar avaliacao    |
| PUT    | /api/avaliacoes/:id   | Editar avaliacao   |
| DELETE | /api/avaliacoes/:id   | Excluir avaliacao  |

> O backend esta no plano gratuito do Render. Na primeira requisicao pode demorar ate 60 segundos para acordar.
