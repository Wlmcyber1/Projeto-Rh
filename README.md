# Sistema de Consultoria Alimentar

Sistema web para gerenciar as visitas técnicas realizadas por uma consultoria alimentícia em empresas do ramo de alimentos. O projeto substitui um processo que hoje é feito manualmente em planilhas, unindo em um único lugar o que é feito pelo RH e o que é registrado pelos funcionários em campo.

## O que o sistema faz

- Registra as visitas técnicas realizadas pelos funcionários.
- Centraliza informações que antes ficavam espalhadas entre planilhas e um sistema externo (FoodChecker).
- Gera relatórios em PDF a partir dos dados registrados.

## Tecnologias utilizadas

- **[React 19](https://react.dev/) + [Vite](https://vitejs.dev/)** — interface do usuário e ambiente de build/dev
- **[Supabase](https://supabase.com/)** — banco de dados (Postgres), autenticação e armazenamento de arquivos
- **[react-router-dom](https://reactrouter.com/)** — roteamento entre páginas
- **[react-hook-form](https://react-hook-form.com/)** — formulários (ex.: registro de visita)
- **[jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)** — geração da folha de pagamento em PDF
- **[SweetAlert2](https://sweetalert2.github.io/)** — alertas e confirmações estilizadas
- **[ESLint](https://eslint.org/)** — padronização/lint do código

## Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (recomendado versão 18 ou superior)
- Acesso ao projeto Supabase (peça um convite para quem administra o projeto — veja a seção abaixo)

### Passo a passo

1. Clone o repositório e entre na pasta do projeto (o código do Vite fica dentro da subpasta `ataFlow/`):
   ```bash
   git clone https://github.com/Wlmcyber1/Projeto-Rh
   cd Projeto-Rh/ataFlow
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

```
ataFlow/
├── public/                        # arquivos estáticos servidos direto (favicon, ícones)
├── src/
│   ├── main.jsx                   # ponto de entrada da aplicação
│   ├── App.jsx                    # componente raiz, renderiza as rotas
│   ├── AppRoutes.jsx              # definição de todas as rotas (react-router-dom)
│   ├── TelaAcesso.jsx / .css      # tela de login
│   ├── Legislacao.jsx / .css      # tela de legislação (federal/estadual/alimentos/rotulagem)
│   ├── Pdf.jsx / .css             # geração da folha de pagamento em PDF
│   ├── supabaseClient.js          # configuração do client do Supabase
│   ├── assets/                    # imagens usadas na interface (hero, logos)
│   ├── data/                      # JSONs estáticos com conteúdo de legislação
│   ├── abaFuncionario/            # módulo do Funcionário
│   │   ├── RegistrarVisita.jsx    # formulário de registro de visita técnica
│   │   └── homeFuncionario/
│   │       └── HomeFuncionario.jsx  # tela inicial do funcionário (histórico de visitas)
│   └── abaRh/                     # módulo do RH / Admin
│       ├── HomeAdmin.jsx          # painel principal com menu lateral
│       ├── AdicionarEmpresa.jsx   # cadastro de empresa parceira
│       ├── VisualizaçãoEmpresa.jsx # listagem de empresas cadastradas
│       ├── VisualizacaoAtas.jsx   # histórico de atas (ainda com dados estáticos)
│       ├── FechamentoFolha.jsx    # cálculo e painel de fechamento de folha
│       └── abasFuncoesHome/
│           └── VisualizacaoFuncionarias.jsx  # listagem de funcionárias (ainda com dados estáticos)
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
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

Para entender o funcionamento detalhado de cada tela, os bugs conhecidos e os próximos ajustes planejados, consulte [`DOCUMENTACAO_TECNICA.md`](./DOCUMENTACAO_TECNICA.md).
