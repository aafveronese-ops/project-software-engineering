# Cargo48

![Cargo48 Logo](https://static.getmocha.com/og.png) <!-- Você pode substituir esta imagem pelo seu logo real, se tiver um. -->

Antecipação de recebíveis de frete em até 48 horas. Liquidez para motoristas, prazo para embarcadores.

## Sobre o Projeto

Cargo48 é uma plataforma inovadora que conecta motoristas autônomos e empresas embarcadoras, otimizando o processo de transporte de cargas e oferecendo antecipação de recebíveis. Nosso objetivo é proporcionar liquidez rápida para motoristas e prazos flexíveis de pagamento para embarcadores, simplificando a logística do frete no Brasil.

## Funcionalidades Principais

### Para Motoristas
*   **Buscar Fretes Disponíveis**: Visualize uma lista de fretes próximos e adequados ao seu veículo.
*   **Aceitar Fretes**: Com um clique, aceite um frete e adicione-o à sua lista de viagens.
*   **Gerenciamento de Fretes**: Acompanhe o status dos seus fretes, confirme coleta e entrega diretamente pelo aplicativo.
*   **Antecipação de Recebíveis**: Garanta o pagamento em até 48 horas após a entrega, melhorando seu fluxo de caixa.
*   **Cadastro Simplificado**: Formulário de perfil completo para dados pessoais, do veículo e de documentação (CNH, ANTT).

### Para Embarcadores
*   **Publicar Fretes**: Crie e publique novos fretes com detalhes de carga, rotas, datas e valores.
*   **Acompanhamento em Tempo Real**: Monitore o status de todos os fretes publicados, desde a aceitação até a entrega final.
*   **Gerenciamento de Motoristas**: Visualize informações do motorista atribuído e confirme o início do transporte.
*   **Documentação e FAQ**: Acesse um guia completo sobre como utilizar a plataforma.

## Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e ferramentas:

*   **Frontend**:
*   [**React**](https://reactjs.org/): Biblioteca JavaScript para construção de interfaces de usuário.
*   [**TypeScript**](https://www.typescriptlang.org/): Superset de JavaScript que adiciona tipagem estática.
*   [**Tailwind CSS**](https://tailwindcss.com/): Framework CSS utilitário para design rápido e responsivo.
*   [**Vite**](https://vitejs.dev/): Ferramenta de build rápida para desenvolvimento web moderno.
*   [**`lucide-react`**](https://lucide.dev/): Biblioteca de ícones para React.
*   [**`react-router-dom`**](https://reactrouter.com/): Para roteamento no lado do cliente.
*   **Backend (Cloudflare Worker)**:
*   [**Hono**](https://hono.dev/): Um framework web leve, rápido e moderno para Edge.
*   [**Cloudflare D1**](https://developers.cloudflare.com/d1/): Banco de dados SQL serverless, rodando no Edge.
*   [**@getmocha/users-service**](https://getmocha.com/): Serviço de autenticação e gerenciamento de usuários integrado.
*   **Outras Ferramentas**:
*   [**ESLint**](https://eslint.org/): Para padronização e linting de código.
*   [**Zod**](https://zod.dev/): Para validação de schemas em TypeScript.

## Configuração para Desenvolvimento Local

Para configurar o Cargo48 em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

*   [Node.js](https://nodejs.org/) (versão LTS recomendada)
*   [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) ou [Bun](https://bun.sh/)
*   [Git](https://git-scm.com/)

### Instalação

1.  **Clone o repositório:**

```bash
git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
cd Cargo48
