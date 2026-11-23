import type { Engineering, Example, Platform, PowerLevel, WizardStep } from '@po/types';

export interface LevelInfo {
  id: PowerLevel;
  name: string;
  color: string;
  description: string;
  includes: string[];
}

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    name: 'Rascunho rápido',
    color: '#3b82f6',
    description: 'Ideias, experimentos e provas de conceito.',
    includes: ['estrutura mínima', 'protótipo', 'validação simples'],
  },
  {
    id: 2,
    name: 'Básico',
    color: '#10b981',
    description: 'Estrutura organizada, responsividade e persistência inicial.',
    includes: ['responsividade', 'validações', 'persistência básica', 'documentação inicial'],
  },
  {
    id: 3,
    name: 'Profissional',
    color: '#eab308',
    description: 'Arquitetura modular, autenticação, banco, testes e segurança.',
    includes: ['arquitetura modular', 'autenticação', 'banco de dados', 'testes', 'segurança', 'Git'],
  },
  {
    id: 4,
    name: 'Avançado',
    color: '#f97316',
    description: 'APIs, cache, observabilidade, CI/CD e otimização.',
    includes: ['arquitetura escalável', 'APIs', 'cache', 'observabilidade', 'CI/CD', 'testes avançados'],
  },
  {
    id: 5,
    name: 'Enterprise',
    color: '#a855f7',
    description: 'Alta escala, auditoria, RBAC, alta disponibilidade e DR.',
    includes: ['RBAC', 'auditoria', 'logs estruturados', 'alta disponibilidade', 'recuperação de desastre', 'CI/CD completo'],
  },
];

export const PLATFORMS: Array<{ id: Platform; label: string; description: string; icon: string }> = [
  { id: 'web', label: 'Web App', description: 'Aplicação executada diretamente no navegador.', icon: '🌐' },
  { id: 'pwa', label: 'PWA', description: 'Site instalável como aplicativo no celular e computador.', icon: '📲' },
  { id: 'desktop', label: 'Desktop', description: 'Aplicativo instalado diretamente no sistema operacional.', icon: '🖥️' },
];

export interface EngineeringOption {
  id: keyof Engineering;
  label: string;
  description: string;
  technical: string;
  explanation: string;
  tooltip: string;
  impact: string;
  icon: string;
  recommendedLevel: PowerLevel;
}

export const ENGINEERING_OPTIONS: EngineeringOption[] = [
  { id: 'git', label: 'Git', description: 'Guarda o histórico de alterações.', technical: 'Controle de versão distribuído', explanation: 'Guarda o histórico das alterações do projeto.', tooltip: 'Permite voltar atrás e trabalhar em equipe.', impact: 'Baixo', icon: '🌿', recommendedLevel: 1 },
  { id: 'conventionalCommits', label: 'Conventional Commits', description: 'Padroniza as mensagens de commit.', technical: 'Padrão de mensagens de commit', explanation: 'Padroniza as mensagens para gerar changelog automático.', tooltip: 'Ex.: feat:, fix:, docs:.', impact: 'Baixo', icon: '📝', recommendedLevel: 2 },
  { id: 'modularArchitecture', label: 'Arquitetura modular', description: 'Organiza o código em partes independentes.', technical: 'Separação em módulos independentes', explanation: 'Organiza o código em partes pequenas e trocáveis.', tooltip: 'Facilita manutenção e testes.', impact: 'Médio', icon: '🧩', recommendedLevel: 3 },
  { id: 'tests', label: 'Testes automatizados', description: 'Verifica o sistema automaticamente.', technical: 'Testes unitários, integração e E2E', explanation: 'Verifica automaticamente se o sistema continua funcionando.', tooltip: 'Reduz bugs e permite mudanças com segurança.', impact: 'Médio', icon: '✅', recommendedLevel: 3 },
  { id: 'documentation', label: 'Documentação', description: 'Explica como usar e manter o sistema.', technical: 'README e docs técnicas', explanation: 'Explica como instalar, usar e manter o projeto.', tooltip: 'Essencial para equipes e projetos longos.', impact: 'Baixo', icon: '📚', recommendedLevel: 1 },
  { id: 'cicd', label: 'CI/CD', description: 'Automatiza testes e publicação.', technical: 'Integração e entrega contínuas', explanation: 'Automatiza testes e publicação do software.', tooltip: 'Roda verificações a cada alteração.', impact: 'Alto', icon: '⚙️', recommendedLevel: 4 },
  { id: 'security', label: 'Segurança reforçada', description: 'Protege contra entradas maliciosas.', technical: 'Validação, CSP e sanitização', explanation: 'Protege o sistema contra entradas maliciosas.', tooltip: 'Inclui XSS, injeção e segredos fora do código.', impact: 'Alto', icon: '🔒', recommendedLevel: 3 },
  { id: 'authentication', label: 'Autenticação', description: 'Permite que cada pessoa entre com sua conta.', technical: 'Identidade e sessão de usuários', explanation: 'Permite que cada pessoa entre com sua conta.', tooltip: 'Requer gerenciamento de sessão e segurança.', impact: 'Alto', icon: '👤', recommendedLevel: 3 },
  { id: 'database', label: 'Banco de dados', description: 'Armazena as informações de forma organizada.', technical: 'Persistência estruturada', explanation: 'Guarda as informações do sistema de forma organizada.', tooltip: 'Pode ser local (IndexedDB) ou servidor (PostgreSQL).', impact: 'Médio', icon: '🗄️', recommendedLevel: 2 },
  { id: 'api', label: 'API', description: 'Conecta sistemas diferentes entre si.', technical: 'Interface de comunicação REST/GraphQL', explanation: 'É uma ponte que permite que sistemas diferentes conversem.', tooltip: 'Necessária quando há backend ou integrações.', impact: 'Alto', icon: '🔌', recommendedLevel: 4 },
  { id: 'offline', label: 'Offline', description: 'Continua funcionando sem conexão.', technical: 'Funcionamento sem conexão', explanation: 'O aplicativo continua funcionando sem internet.', tooltip: 'Usa cache e armazenamento local.', impact: 'Médio', icon: '📴', recommendedLevel: 2 },
  { id: 'pwa', label: 'PWA', description: 'Instala o site como aplicativo.', technical: 'Progressive Web Application', explanation: 'Permite instalar o site como aplicativo e usar recursos offline.', tooltip: 'Requer manifest, Service Worker e HTTPS.', impact: 'Médio', icon: '📲', recommendedLevel: 2 },
  { id: 'desktop', label: 'Desktop', description: 'Gera um instalador para o sistema operacional.', technical: 'Runtime desktop empacotado', explanation: 'Gera um instalador para Windows, Linux ou macOS.', tooltip: 'Requer runtime, empacotamento e instalador.', impact: 'Alto', icon: '🖥️', recommendedLevel: 3 },
  { id: 'observability', label: 'Observabilidade', description: 'Mostra como o sistema está se comportando.', technical: 'Métricas, traces e health checks', explanation: 'Mostra como o sistema está se comportando em produção.', tooltip: 'Ajuda a detectar problemas antes dos usuários.', impact: 'Alto', icon: '📈', recommendedLevel: 4 },
  { id: 'logs', label: 'Logs', description: 'Registra eventos importantes para investigação.', technical: 'Registro estruturado de eventos', explanation: 'Registra o que aconteceu para facilitar investigações.', tooltip: 'Nunca registrar segredos ou dados sensíveis.', impact: 'Baixo', icon: '📋', recommendedLevel: 4 },
  { id: 'audit', label: 'Auditoria', description: 'Registra quem fez o quê e quando.', technical: 'Trilha de auditoria imutável', explanation: 'Registra quem fez o quê e quando.', tooltip: 'Comum em sistemas regulados e enterprise.', impact: 'Alto', icon: '🔍', recommendedLevel: 5 },
  { id: 'backup', label: 'Backup', description: 'Guarda cópias para recuperar dados.', technical: 'Cópias e recuperação', explanation: 'Guarda cópias para recuperar dados após falhas.', tooltip: 'Inclui retenção e restauração testada.', impact: 'Médio', icon: '💾', recommendedLevel: 4 },
];

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, key: 'idea', title: 'A ideia', description: 'Conte o que você quer criar' },
  { id: 2, key: 'platform', title: 'Plataforma', description: 'Onde o sistema vai rodar' },
  { id: 3, key: 'engineering', title: 'Engenharia', description: 'Como o sistema será construído' },
  { id: 4, key: 'power', title: 'Potência', description: 'Qual o nível de profundidade' },
  { id: 5, key: 'review', title: 'Revisão', description: 'Confira antes de gerar' },
  { id: 6, key: 'result', title: 'Resultado', description: 'Especificação e prompt' },
];

const idea = (name: string, description: string, audience: string, problem: string, features: string, similar: string) => ({
  name, description, audience, problem, features, similar,
});

export const EXAMPLES: Example[] = [
  {
    id: 'financas', category: 'Finanças', title: 'Controle financeiro pessoal',
    idea: idea('Finanças Pessoais', 'Aplicativo para registrar receitas, despesas, metas e gerar relatórios mensais.', 'Pessoas que querem organizar o dinheiro', 'Dificuldade de entender para onde vai o dinheiro', 'Lançamentos, categorias, orçamento, metas, gráficos e exportação', 'Semelhante a aplicativos de banco pessoal'),
    platforms: ['web', 'pwa'], level: 3,
    engineering: { authentication: true, database: true, tests: true, git: true, pwa: true },
  },
  {
    id: 'loja', category: 'Loja virtual', title: 'Loja virtual completa',
    idea: idea('Minha Loja', 'Catálogo de produtos, carrinho, pedidos e checkout online.', 'Donos de pequenos negócios', 'Vender pela internet sem depender de marketplaces', 'Catálogo, carrinho, checkout, gestão de pedidos e relatórios', 'Semelhante a Shopify'),
    platforms: ['web', 'pwa'], level: 4,
    engineering: { api: true, authentication: true, database: true, tests: true, cicd: true, security: true },
  },
  {
    id: 'cftv', category: 'CFTV', title: 'Monitoramento de câmeras',
    idea: idea('Monitor CFTV', 'Painel para acompanhar câmeras, eventos e relatórios de segurança.', 'Empresas e condomínios', 'Centralizar o monitoramento de câmeras', 'Lista de câmeras, eventos, alertas, relatórios e usuários', 'Semelhante a sistemas de segurança'),
    platforms: ['web', 'desktop'], level: 4,
    engineering: { authentication: true, api: true, observability: true, logs: true, audit: true, database: true },
  },
  {
    id: 'crm', category: 'CRM', title: 'Gestão de contatos e vendas',
    idea: idea('CRM Simples', 'Gerenciar clientes, oportunidades e etapas do funil de vendas.', 'Equipes comerciais', 'Perder oportunidades por falta de acompanhamento', 'Contatos, funil, tarefas, lembretes e relatórios', 'Semelhante a HubSpot'),
    platforms: ['web', 'pwa'], level: 3,
    engineering: { authentication: true, database: true, tests: true, git: true },
  },
  {
    id: 'erp', category: 'ERP', title: 'ERP para pequena empresa',
    idea: idea('ERP Leve', 'Integrar estoque, financeiro, vendas e pessoas em um só sistema.', 'Pequenas e médias empresas', 'Sistemas separados que não conversam', 'Estoque, vendas, financeiro, relatórios e permissões', 'Semelhante a ERPs tradicionais'),
    platforms: ['web', 'desktop'], level: 5,
    engineering: { authentication: true, database: true, api: true, audit: true, backup: true, observability: true, tests: true },
  },
  {
    id: 'agenda', category: 'Agenda', title: 'Agenda de compromissos',
    idea: idea('Minha Agenda', 'Agendar compromissos com lembretes e visualização de calendário.', 'Profissionais autônomos', 'Esquecer compromissos e horários', 'Calendário, lembretes, recorrência e sincronização', 'Semelhante ao Google Agenda'),
    platforms: ['web', 'pwa'], level: 2,
    engineering: { database: true, pwa: true, offline: true, documentation: true },
  },
  {
    id: 'igreja', category: 'Igreja', title: 'Gestão de membros e eventos',
    idea: idea('Gestão da Igreja', 'Cadastrar membros, eventos, escalas e enviar avisos.', 'Comunidades religiosas', 'Organizar informações e comunicação da comunidade', 'Membros, eventos, escalas, avisos e relatórios', 'Semelhante a sistemas de gestão eclesiástica'),
    platforms: ['web', 'pwa'], level: 3,
    engineering: { authentication: true, database: true, git: true, tests: true },
  },
  {
    id: 'escola', category: 'Escola', title: 'Gestão escolar',
    idea: idea('Gestão Escolar', 'Alunos, turmas, notas, faltas e comunicação com responsáveis.', 'Escolas e professores', 'Centralizar o acompanhamento dos alunos', 'Alunos, turmas, notas, faltas, boletins e avisos', 'Semelhante a sistemas de gestão escolar'),
    platforms: ['web'], level: 4,
    engineering: { authentication: true, database: true, api: true, tests: true, security: true, audit: true },
  },
  {
    id: 'estoque', category: 'Estoque', title: 'Controle de estoque',
    idea: idea('Controle de Estoque', 'Entradas, saídas, inventário e alertas de estoque baixo.', 'Lojas e ateliês', 'Perder produtos e não saber quando repor', 'Produtos, movimentações, alertas e relatórios', 'Semelhante a sistemas de inventário'),
    platforms: ['web', 'pwa', 'desktop'], level: 3,
    engineering: { database: true, offline: true, tests: true, pwa: true, desktop: true },
  },
  {
    id: 'servicos', category: 'Serviços', title: 'Ordens de serviço',
    idea: idea('Gestão de Serviços', 'Registrar solicitações, acompanhar status e gerar orçamentos.', 'Prestadores de serviço', 'Desorganizar pedidos e prazos', 'Ordens, status, clientes, orçamentos e relatórios', 'Semelhante a sistemas de assistência técnica'),
    platforms: ['web', 'pwa'], level: 3,
    engineering: { database: true, authentication: true, tests: true, pwa: true },
  },
  {
    id: 'dashboard', category: 'Dashboard', title: 'Painel de indicadores',
    idea: idea('Painel de Indicadores', 'Visualizar métricas de negócio em gráficos e cartões.', 'Gestores e equipes', 'Tomar decisões sem dados claros', 'Gráficos, filtros, KPIs, exportação e atualização automática', 'Semelhante a ferramentas de BI'),
    platforms: ['web'], level: 4,
    engineering: { api: true, observability: true, tests: true, cicd: true },
  },
  {
    id: 'rede', category: 'Rede social', title: 'Rede social nichada',
    idea: idea('Comunidade', 'Publicações, comentários, curtidas e perfis para um nicho específico.', 'Comunidades com interesses comuns', 'Falta de espaço para troca focada', 'Feed, perfis, comentários, mensagens e moderação', 'Semelhante a redes sociais tradicionais'),
    platforms: ['web', 'pwa'], level: 5,
    engineering: { authentication: true, database: true, api: true, security: true, audit: true, tests: true, observability: true },
  },
  {
    id: 'blog', category: 'Blog', title: 'Blog com CMS simples',
    idea: idea('Meu Blog', 'Publicar artigos com categorias, busca e área administrativa.', 'Criadores de conteúdo', 'Publicar sem depender de plataformas complexas', 'Artigos, categorias, busca, admin e RSS', 'Semelhante a WordPress'),
    platforms: ['web', 'pwa'], level: 2,
    engineering: { pwa: true, documentation: true, database: true },
  },
  {
    id: 'pwa', category: 'PWA', title: 'Aplicativo instalável offline',
    idea: idea('App Offline', 'Aplicativo web que funciona sem internet e pode ser instalado.', 'Usuários com conexão instável', 'Perder acesso ao cair a internet', 'Instalação, cache, sincronização e notificações', 'Semelhante a um aplicativo nativo'),
    platforms: ['pwa'], level: 3,
    engineering: { pwa: true, offline: true, database: true, tests: true, git: true },
  },
  {
    id: 'empresarial', category: 'Sistema empresarial', title: 'Portal corporativo',
    idea: idea('Portal Corporativo', 'Centralizar documentos, avisos, equipes e processos internos.', 'Empresas com times distribuídos', 'Informação espalhada em vários canais', 'Documentos, avisos, departamentos, permissões e relatórios', 'Semelhante a intranets'),
    platforms: ['web', 'pwa', 'desktop'], level: 5,
    engineering: { authentication: true, api: true, security: true, audit: true, backup: true, observability: true, logs: true, cicd: true, tests: true },
  },
];

export const EXAMPLE_CATEGORIES = [...new Set(EXAMPLES.map((example) => example.category))];

export function getLevel(level: PowerLevel): LevelInfo {
  return LEVELS.find((item) => item.id === level) ?? LEVELS[0];
}
