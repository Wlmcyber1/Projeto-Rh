# Sistema de Consultoria Alimentar

Sistema web para gerenciar as visitas técnicas realizadas por uma consultoria alimentícia em empresas do ramo de alimentos. O projeto substitui um processo que hoje é feito manualmente em planilhas, unindo em um único lugar o que é feito pelo RH e o que é registrado pelos funcionários em campo.

## O que o sistema faz

- Registra as visitas técnicas realizadas pelos funcionários.
- Centraliza informações que antes ficavam espalhadas entre planilhas e um sistema externo (FoodChecker).
- Gera relatórios em PDF a partir dos dados registrados.

## Tecnologias utilizadas

- **[React](https://react.dev/)** — interface do usuário
- **[Supabase](https://supabase.com/)** — banco de dados (Postgres), autenticação e armazenamento de arquivos
- **[react-router-dom](https://reactrouter.com/)** — roteamento entre páginas
- **[jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)** — geração de relatórios em PDF

## Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (recomendado versão 18 ou superior)
- Acesso ao projeto Supabase (peça um convite para quem administra o projeto — veja a seção abaixo)

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repo.git
   cd nome-do-repo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Depois abra o `.env` e preencha com os valores do projeto Supabase (URL e chave anônima). Você encontra esses valores no painel do Supabase em **Project Settings > API**, desde que já tenha sido convidado para o projeto.

4. Rode o projeto em modo desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Acesso ao Supabase

O acesso ao banco de dados é gerenciado separadamente do GitHub. Para conseguir rodar o projeto conectado ao banco real, é preciso:

1. Ser convidado para o projeto no Supabase (peça a quem administra o projeto para te adicionar em **Project Settings > Team**).
2. Depois de aceitar o convite, copiar a URL e a chave anônima em **Project Settings > API** e colar no seu `.env` local, conforme o passo 3 acima.

## Estrutura do projeto

> Ajuste esta seção conforme a organização real de pastas do projeto.

```
src/
  components/   # componentes reutilizáveis da interface
  pages/        # páginas/rotas da aplicação
  services/     # comunicação com o Supabase
  utils/        # funções auxiliares
```

## Contribuindo

1. Crie uma branch a partir da `main` para a sua tarefa:
   ```bash
   git checkout -b nome-da-feature
   ```
2. Faça as alterações e os commits.
3. Envie a branch e abra um Pull Request:
   ```bash
   git push origin nome-da-feature
   ```
4. Peça revisão antes de mesclar na `main`.

## Documentação adicional

Para entender o funcionamento detalhado de cada parte do sistema, consulte a documentação em `[nome do arquivo de documentação]`.