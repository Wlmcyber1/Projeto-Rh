# AtaFlow — Documentação Técnica

> Sistema web para consultoria alimentícia (React + Supabase) que unifica o controle do RH e o registro de visitas técnicas dos funcionários, substituindo o processo manual em planilhas.

**Stack:** React 19 + Vite · Supabase (Postgres + Auth) · react-router-dom · jsPDF/jspdf-autotable · SweetAlert2

---

## 1. O que já foi feito (Status Atual do Projeto)

### Autenticação e navegação
- Tela de login (`TelaAcesso.jsx`) com Supabase Auth (`signInWithPassword`) e busca do perfil na tabela `users` para descobrir a categoria (`funcionario`/`rh`/`admin`) e redirecionar para a tela correta.
- Estrutura de rotas centralizada em `AppRoutes.jsx` cobrindo login, área do funcionário, área do RH, cadastro de empresa e geração de PDF.

### Módulo do Funcionário
- **HomeFuncionario**: tela de boas-vindas com o nome do usuário logado e histórico de visitas (data, empresa, horas) puxado da tabela `ataVisitas` já com o nome da empresa via relacionamento.
- **RegistrarVisita**: formulário completo para lançar uma visita — seleção de empresa (carregada do Supabase), data, hora de entrada/saída, descrição das atividades — com cálculo automático do tempo total trabalhado e gravação na tabela `ataVisitas`.

### Módulo do RH / Admin
- **HomeAdmin**: painel com menu lateral (sidebar recolhível), navegação entre os módulos internos e tela de "visão geral" com cards de acesso rápido.
- **AdicionarEmpresa**: formulário em modal para cadastrar uma nova empresa parceira na tabela `empresas`.
- **VisualizacaoEmpresa**: lista em tempo real as empresas cadastradas no Supabase, com botão para abrir o cadastro de nova empresa.
- **FechamentoFolha**: painel que busca horas trabalhadas por funcionário (`ataVisitas` + `users`) e calcula o salário estimado (R$60/hora + adicional fixo de R$200), exibindo uma tabela-resumo por funcionário e uma tabela detalhada por visita.

### Geração de PDF
- **Pdf.jsx**: botão que gera a folha de pagamento em PDF (jsPDF + jspdf-autotable) com os mesmos dados de horas e salário calculados no painel do RH.

### Legislação
- **Legislacao.jsx**: navegação por categorias (Federal, Estadual, Alimentos, Rotulagem), com conteúdo alimentado por arquivos JSON locais (`estadosBrasil`, `legislacaoFederal`, `legislacaoAlimentos`, `legislacaoRotulagem`). Acessível tanto pelo funcionário quanto embutida dentro do painel do RH. **A própria tela avisa que o conteúdo hoje é ilustrativo**, aguardando os links oficiais definitivos.

### Identidade visual
- CSS próprio por módulo (mais de 2.300 linhas no total) e uso do SweetAlert2 para alertas e confirmações estilizadas (login, logout, cadastro de empresa).

---

## 2. Erros Conhecidos / Bugs

| # | Onde | Problema |
|---|------|----------|
| 1 | `AdicionarEmpresa.jsx` | `navigate("/admin/home")` é chamado na **primeira linha** do `handleSubmit`, antes de validar o nome e antes do `await` do insert no Supabase. O usuário é redirecionado para o painel antes de saber se o cadastro deu certo — se o insert falhar, o alerta de erro nunca aparece na tela, pois já mudou de página. |
| 2 | Rotas em geral | Nenhuma rota (`/admin/home`, `/funcionario/home`, `/gerar-pdf`, `/adicionarEmpresa`) verifica se há usuário autenticado. O "logado" é apenas um `useState` local dentro de `TelaAcesso.jsx` — basta digitar a URL direto no navegador para entrar no painel do RH ou do Funcionário sem login. |
| 3 | `HomeAdmin.jsx` / `HomeFuncionario.jsx` | O logout não chama `supabase.auth.signOut()`. O token de sessão continua válido mesmo depois de "sair", só a tela volta pro login. |
| 4 | `VisualizacaoAtas.jsx` | Histórico de atas e os filtros ("Filtrar por Funcionária/Empresa") são 100% estáticos (dados fixos no código) — não vêm do Supabase e os selects não filtram nada. |
| 5 | `VisualizacaoFuncionarias.jsx` | Lista de colaboradoras é fixa no código (Fran Rodrigues, Irisney Silva) — não busca a tabela `users`. |
| 6 | `FechamentoFolha.jsx` | Os selects "Mês de Competência" e "Nome funcionário" têm opções fixas e desalinhadas (ex.: valor `"2026-05"` com o texto "fran") e **não filtram** a tabela exibida — são decorativos. |
| 7 | `Pdf.jsx` + `FechamentoFolha.jsx` | A mesma lógica de busca e cálculo de horas/salário está duplicada nos dois arquivos. Além disso, `FechamentoFolha` renderiza `<Pdf />` dentro de si — ou seja, toda vez que a tela abre, a busca ao Supabase roda **duas vezes**. |
| 8 | `FechamentoFolha.jsx` | Os dois `<select>` ("Mês" e "Nome funcionário") usam o mesmo `id="mes"` — inválido em HTML; o `<label htmlFor="mes">` só funciona para o primeiro campo. |
| 9 | `VisualizacaoEmpresa.jsx` / `VisualizacaoFuncionarias.jsx` | Botão "Editar" não tem `onClick` nem lógica nenhuma — é só decorativo. |
| 10 | `VisualizacaoEmpresa.jsx` | Botão "Cadastrar Empresa" chama `navigate("adicionarEmpresa")` (caminho relativo, sem "/"), mas a rota registrada é `/adicionarEmpresa` — dependendo de onde o componente está montado, pode não abrir a tela certa. |
| 11 | `HomeAdmin.jsx` | Existe todo um bloco para renderizar `telaAtiva === "atas"` (`VisualizacaoAtas`), mas nenhum botão do menu define esse valor — código inalcançável pelo usuário. |
| 12 | `HomeAdmin.jsx` / `HomeFuncionario.jsx` | `navigate("*")` (RH) e `navigate("/login")` (Funcionário) usados para sair não correspondem a nenhuma rota real (o login é em `"/"`). Funciona "por acaso" porque a rota `*` é um catch-all que redireciona pro login, mas não é o caminho correto. |
| 13 | `RegistrarVisita.jsx` | Não há validação: é possível salvar a visita sem selecionar empresa e sem preencher data/horários (nenhum campo tem `required`). |
| 14 | `HomeAdmin.jsx` | Função `infoFuncionario` busca `hora_entrada`/`hora_saida` no Supabase mas nunca guarda o resultado em estado nem usa em lugar nenhum — código morto. |
| 15 | Vários arquivos | Comentários de anotação pessoal deixados no código, ex.: `// AJUSTAR BOTÃO DE PAGAMENTO...` (`HomeFuncionario.jsx`), `// adicionar restrições` (`AdicionarEmpresa.jsx`) — pendências que não estão formalizadas em nenhum lugar (agora estão listadas abaixo). |

---

## 3. Próximos Ajustes Necessários

1. Implementar proteção de rotas (ex.: componente de rota privada + contexto de autenticação usando `supabase.auth.onAuthStateChange`), substituindo o controle local (`useState`) por sessão real.
2. Chamar `supabase.auth.signOut()` nos dois fluxos de logout (RH e Funcionário).
3. Corrigir a ordem de operações em `AdicionarEmpresa.jsx`: validar → salvar no Supabase → só então navegar/fechar o modal.
4. Conectar `VisualizacaoAtas` e `VisualizacaoFuncionarias` ao Supabase (dados reais) e fazer os filtros funcionarem de fato.
5. Unificar a lógica de cálculo da folha de pagamento em um único lugar (hook ou função utilitária) reaproveitado por `FechamentoFolha` e `Pdf`, eliminando a busca duplicada.
6. Tornar o valor da hora (R$60) e o adicional fixo (R$200) configuráveis (ex.: tabela de configuração no Supabase) em vez de valores fixos no código.
7. Corrigir os `id`s duplicados e os selects de filtro de mês/funcionário em `FechamentoFolha`.
8. Implementar a ação "Editar" nas telas de Empresas e Funcionárias.
9. Adicionar validação (`required` + mensagens de erro) no formulário de Registrar Visita.
10. Padronizar o feedback ao usuário: hoje mistura `alert()` nativo com SweetAlert2 — unificar em SweetAlert2 em todos os fluxos.
11. Cadastrar os links oficiais reais na tela de Legislação (hoje o conteúdo é assumidamente ilustrativo).
12. Remover código morto (`infoFuncionario`, bloco "atas" inacessível em `HomeAdmin`, imports não usados em `App.jsx`).
13. Corrigir as chamadas de navegação incorretas (`navigate("*")` e `navigate("/login")`) para usar a rota real de login (`"/"`).

---

## 4. Divisão de Tarefas

> Divisão pensada para equilibrar carga entre as duas: **Lais** fica com o eixo de autenticação/segurança e integração de dados com o Supabase; **Laura** fica com o eixo de formulários/UX e a limpeza de código. Os itens têm o mesmo peso aproximado (2 críticos + 2 médios + itens de limpeza cada).

### Lais — Autenticação, Segurança e Dados
- [ ] Implementar proteção de rotas / contexto de autenticação (item 1)
- [ ] Implementar `signOut()` real no logout do RH e do Funcionário (item 2)
- [ ] Conectar `VisualizacaoAtas` ao Supabase com filtros funcionais (item 4, parte 1)
- [ ] Conectar `VisualizacaoFuncionarias` ao Supabase (item 4, parte 2)
- [ ] Corrigir as chamadas de navegação de logout (`navigate("*")` / `navigate("/login")`) (item 13)
- [ ] Unificar o cálculo da folha de pagamento em um único lugar (`FechamentoFolha` + `Pdf`) e adicionar Filtro para que seja mostrado na folha somente 1 funcionario por vez (item 5)
### Laura — Formulários, UX e Limpeza de Código
- [ ] Corrigir a ordem de operações em `AdicionarEmpresa.jsx` (validar → salvar → navegar) (item 3)
- [ ] Tornar valor/hora e adicional configuráveis (item 6)
- [ ] Corrigir `id`s duplicados e selects de filtro em `FechamentoFolha` (item 7)
- [ ] Implementar ação "Editar" em Empresas e Funcionárias (item 8)
- [ ] Adicionar validação no formulário de Registrar Visita (item 9)
- [ ] Padronizar feedback (SweetAlert2 em todos os fluxos) (item 10)
- [ ] Remover código morto e imports não usados (item 12)

### Compartilhado / a definir com o cliente
- [ ] Cadastrar os links oficiais da tela de Legislação (item 11) — depende de material que precisa ser levantado com o dono da empresa, pode ser dividido igualmente conforme a disponibilidade de cada uma (a ser conversado)
- [ ] ajustar a segurança do banco de dados supabase