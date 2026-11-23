import type { Specification } from '@po/types';

type Section = { id: string; title: string; body: string[] };

const linhas = (texto: string) => texto.split('\n').map((linha) => linha.trim()).filter(Boolean);

/** Converte a especificação estruturada em um prompt executável e adaptativo. */
export function generatePrompt(spec: Specification): string {
  const sections: Section[] = [];
  const add = (id: string, title: string, body: string[]) => {
    if (body.length) sections.push({ id, title, body });
  };

  const funcional = linhas(spec.idea.features);
  const publico = spec.users.length ? spec.users : [spec.idea.audience].filter(Boolean);

  add('papel', 'PAPEL DO AGENTE', [
    'Atue como Arquiteto de Software Principal e Engenheiro Full Stack Sênior responsável por ENTREGAR o sistema descrito abaixo.',
    'Você deve implementar, integrar, testar, documentar e validar. Não entregue apenas planejamento, wireframes ou trechos isolados.',
  ]);

  add('objetivo', 'OBJETIVO', [
    spec.idea.description || spec.project.description,
    `Nome do projeto: ${spec.project.name}.`,
  ]);

  add('contexto', 'CONTEXTO', [
    `Público-alvo: ${publico.join('; ') || 'usuário final'}.`,
    spec.idea.problem ? `Problema resolvido: ${spec.idea.problem}` : '',
    spec.idea.similar ? `Referência: ${spec.idea.similar}` : '',
    `Nível de potência: ${spec.project.level} de 5.`,
    `Plataformas: ${spec.platforms.join(', ') || 'web'}.`,
  ].filter(Boolean));

  add('funcionais', 'REQUISITOS FUNCIONAIS', [
    ...(funcional.length ? funcional.map((item, i) => `${i + 1}. ${item}`) : [
      '1. Implementar o fluxo principal descrito no objetivo.',
      '2. Validar todas as entradas do usuário.',
      '3. Exibir feedback claro de sucesso e erro.',
    ]),
    'Toda funcionalidade listada deve estar implementada e integrada à interface.',
  ]);

  add('nao-funcionais', 'REQUISITOS NÃO FUNCIONAIS', [
    'Desempenho: interface responsiva e carregamento rápido.',
    'Acessibilidade: contraste, labels, navegação por teclado e mensagens acessíveis.',
    'Segurança: validação, sanitização e nenhum segredo no código-fonte.',
    'Manutenibilidade: código modular, tipado e documentado.',
    'Nenhuma funcionalidade principal pode ficar como TODO, mock ou placeholder.',
  ]);

  add('arquitetura', 'ARQUITETURA', [
    `Estilo: ${spec.architecture.style}.`,
    ...(spec.architecture.modules.length ? [`Módulos: ${spec.architecture.modules.join(', ')}.`] : []),
    ...(spec.architecture.patterns.length ? [`Padrões: ${spec.architecture.patterns.join(', ')}.`] : []),
    'Separar regras de negócio da interface. Regras importantes não devem ficar em componentes visuais.',
  ]);

  add('stack', 'STACK', [
    'TypeScript, React, Vite, Tailwind CSS, Zustand e Zod.',
    'Testes unitários com Vitest e testes E2E com Playwright.',
    ...(spec.platforms.includes('pwa') ? ['PWA com manifest e Service Worker.'] : []),
    ...(spec.platforms.includes('desktop') ? ['Desktop com Tauri.'] : []),
  ]);

  if (spec.database.enabled) {
    const engine = spec.database.engine === 'none' ? 'indexeddb' : spec.database.engine;
    add('banco', 'BANCO DE DADOS', [
      `Persistência com ${engine}.`,
      'Definir esquema, migrações e camada de acesso isolada do restante do código.',
      'Armazenar dados sensíveis com segurança e nunca em texto puro no código-fonte.',
    ]);
  }

  if (spec.api.enabled) {
    add('api', 'API', [
      `API no estilo ${spec.api.style}.`,
      'Contratos tipados, validação de entrada e padronização de erros.',
      'Nunca expor chaves ou credenciais no cliente.',
    ]);
  }

  if (spec.authentication.enabled) {
    add('autenticacao', 'AUTENTICAÇÃO', [
      `Provedores: ${spec.authentication.providers.join(', ') || 'a definir'}.`,
      `Estratégia de sessão: ${spec.authentication.sessionStrategy}.`,
      'Proteger rotas, validar permissões e tratar expiração de sessão.',
    ]);
  }

  if (spec.engineering.security || spec.project.level >= 3) {
    add('seguranca', 'SEGURANÇA', [
      'Validar e sanitizar todas as entradas.',
      'Proteger contra XSS, injeção e vazamento de segredos.',
      ...(spec.security.csp ? ['Configurar Content Security Policy.'] : []),
      ...(spec.security.secretManagement ? ['Armazenar segredos fora do repositório e do bundle.'] : []),
    ]);
  }

  add('interface', 'INTERFACE', [
    'Design system próprio com componentes reutilizáveis e estados visuais completos.',
    'Modos claro e escuro, feedback imediato e mensagens de erro humanas.',
    'Nunca mostrar erros técnicos crus ao usuário.',
  ]);

  add('responsividade', 'RESPONSIVIDADE', [
    'Mobile-first, funcional em 320px, 375px, 768px, 1024px, 1280px e 1920px.',
    'Navegação por teclado, foco visível e áreas clicáveis adequadas.',
  ]);

  if (spec.platforms.includes('pwa') || spec.pwa.enabled) {
    add('pwa', 'PWA', [
      'Manifest válido, Service Worker, cache e funcionamento offline.',
      'Prompt de instalação, detecção de atualização, ícones e theme-color.',
      'O usuário deve conseguir instalar o aplicativo no dispositivo.',
    ]);
  }

  if (spec.platforms.includes('desktop') || spec.desktop.enabled) {
    add('desktop', 'DESKTOP', [
      'Aplicativo Tauri empacotado para Windows, Linux e macOS.',
      'Ícone, atalho, desinstalador e armazenamento local de dados.',
      'Mecanismo de atualização preparado e documentação de build/instalação.',
    ]);
  }

  if (spec.git.enabled) {
    add('git', 'GIT', [
      'Repositório Git com .gitignore e README.',
      ...(spec.git.conventionalCommits ? ['Conventional Commits (feat:, fix:, docs:, test:, chore:).'] : []),
    ]);
  }

  if (spec.testing.enabled) {
    add('testes', 'TESTES', [
      ...(spec.testing.unit ? ['Testes unitários das regras de negócio.'] : []),
      ...(spec.testing.integration ? ['Testes de integração dos fluxos principais.'] : []),
      ...(spec.testing.e2e ? ['Testes E2E do fluxo crítico com Playwright.'] : []),
      'Todos os testes devem passar antes de considerar a tarefa concluída.',
    ]);
  }

  if (spec.engineering.documentation) {
    add('documentacao', 'DOCUMENTAÇÃO', [
      'README com instalação, execução e uso.',
      'Documentação de arquitetura, desenvolvimento, build, deploy e segurança.',
      'Registrar decisões técnicas relevantes.',
    ]);
  }

  add('diretorios', 'ESTRUTURA DE DIRETÓRIOS', [
    'apps/ (web, desktop), packages/ (domínio, regras, validação, persistência, interface), tests/, docs/, .github/workflows/.',
    'Manter responsabilidades separadas e dependências apontando para o domínio, nunca o contrário.',
  ]);

  add('criterios', 'CRITÉRIOS DE ACEITAÇÃO', [
    ...(funcional.length ? funcional.map((item) => `[ ] ${item} está implementado e testado.`) : ['[ ] Fluxo principal implementado e testado.']),
    '[ ] Interface responsiva e acessível.',
    '[ ] Dados persistem e podem ser recuperados.',
    ...(spec.platforms.includes('pwa') ? ['[ ] PWA instala e funciona offline.'] : []),
    ...(spec.platforms.includes('desktop') ? ['[ ] Instalador desktop gera e executa.'] : []),
    ...(spec.testing.enabled ? ['[ ] Testes passando.'] : []),
  ]);

  add('plano', 'PLANO DE IMPLEMENTAÇÃO', [
    '1. Estruturar contratos e domínio antes da interface.',
    '2. Implementar regras de negócio, validação e geração da especificação.',
    '3. Implementar persistência e recuperação.',
    '4. Implementar interface e fluxos completos.',
    '5. Implementar plataformas adicionais.',
    '6. Escrever testes e documentação.',
    '7. Executar validação completa e corrigir falhas.',
  ]);

  add('entregaveis', 'ENTREGÁVEIS', [
    'Código-fonte completo e funcional.',
    'Builds de produção para as plataformas selecionadas.',
    'Testes automatizados e documentação atualizada.',
    'Configuração de Git e CI/CD.',
  ]);

  add('regras', 'REGRAS DE EXECUÇÃO', [
    'Corrigir erros encontrados antes de avançar.',
    'Não mascarar falhas com try/catch genérico.',
    'Não deixar TODOs, mocks ou placeholders no escopo principal.',
    'Não criar dependências desnecessárias nem código duplicado.',
    'Toda decisão técnica relevante deve ser documentada.',
  ]);

  add('conclusao', 'CONDIÇÕES DE CONCLUSÃO', [
    'O sistema somente estará pronto quando: estiver implementado, integrado, testado, validado e documentado.',
    'Executar o fluxo completo de ponta a ponta antes de declarar conclusão.',
  ]);

  return sections.map((section) => `# ${section.title}\n\n${section.body.map((line) => `- ${line}`).join('\n')}`).join('\n\n');
}

export function sectionsOf(prompt: string): string[] {
  return [...prompt.matchAll(/^# .+$/gm)].map((match) => match[0].replace('# ', ''));
}
