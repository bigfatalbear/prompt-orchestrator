import { useEffect, useMemo, useRef, useState } from 'react';
import type { Engineering, Platform, PowerLevel } from '@po/types';
import {
  ENGINEERING_OPTIONS as ENGINES,
  applyExample,
  EXAMPLES,
  EXAMPLE_CATEGORIES,
  getLevel,
  PLATFORMS,
  WIZARD_STEPS,
} from '@po/core';
import { analyzeCoherence, applyCoherenceAction } from '@po/rules-engine';
import { validateStep } from '@po/validation';
import {
  AppShell,
  ConfirmDialog,
  ConsistencyAlert,
  EmptyState,
  InfoCard,
  LevelSelector,
  LoadingState,
  Modal,
  OptionCard,
  PlatformHint,
  ProgressBar,
  PromptEditor,
  ProjectList,
  SuccessState,
  Toast,
  ToggleOption,
  TopBar,
  WizardStepView,
  HowToUse,
  Sidebar,
} from '@po/ui';
import { useApp } from './store';

const field = 'w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600';
const label = 'block text-sm font-medium';

function HomeView() {
  const { projects, recovery, newProject, openProject, duplicate, remove, rename, openHistory, dismissRecovery } = useApp();
  const [category, setCategory] = useState('Todas');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const examples = category === 'Todas' ? EXAMPLES : EXAMPLES.filter((item) => item.category === category);

  return (
    <div className="po-fade space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-xl">
        <p className="text-sm font-medium opacity-80">PROMPT ORCHESTRATOR</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-4xl">Transforme uma ideia em uma especificação profissional.</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90">Responda perguntas em linguagem simples. O sistema organiza requisitos, valida escolhas, gera a arquitetura e entrega um prompt pronto para um agente de IA desenvolver o seu software.</p>
        <button type="button" onClick={newProject} className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow hover:bg-indigo-50">Criar meu primeiro projeto →</button>
      </section>

      {recovery && (
        <InfoCard title="Encontramos um projeto não finalizado.">
          <p>Salvo em {new Date(recovery.savedAt).toLocaleString('pt-BR')} · etapa {recovery.step}.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => void openProject(recovery.projectId)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">Continuar</button>
            <button type="button" onClick={() => void dismissRecovery()} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Descartar</button>
            <button type="button" onClick={newProject} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Começar novo</button>
          </div>
        </InfoCard>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold">Meus projetos</h2>
        <ProjectList projects={projects} onOpen={(id) => void openProject(id)} onDuplicate={(id) => void duplicate(id)}
          onRename={(id) => { const p = projects.find((item) => item.id === id); setRenameId(id); setRenameValue(p?.name ?? ''); }}
          onExport={() => void useApp.getState().exportAs('json')}
          onDelete={setConfirmId} onHistory={(id) => void openHistory(id)} onNew={newProject} />
      </section>

      <section>
        <h2 className="text-xl font-bold">Exemplos prontos</h2>
        <p className="mt-1 text-sm text-slate-500">Escolha uma referência para começar mais rápido. O conteúdo é apenas uma sugestão — você pode editar tudo.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Todas', ...EXAMPLE_CATEGORIES].map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3 py-1.5 text-xs ${category === item ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{item}</button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example) => (
            <article key={example.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{example.category}</p>
              <h3 className="mt-1 font-semibold">{example.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{example.idea.description}</p>
              <button type="button" onClick={() => { newProject(); const fresh = useApp.getState().project; useApp.getState().update(applyExample(fresh, example)); }}
                className="mt-3 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Usar exemplo</button>
            </article>
          ))}
        </div>
      </section>

      <ConfirmDialog open={Boolean(confirmId)} title="Excluir projeto?" message="Esta ação não pode ser desfeita. Versões salvas também serão removidas."
        onCancel={() => setConfirmId(null)} onConfirm={() => { if (confirmId) void remove(confirmId); setConfirmId(null); }} />

      <Modal open={Boolean(renameId)} title="Renomear projeto" onClose={() => setRenameId(null)}>
        <form onSubmit={(event) => { event.preventDefault(); if (renameId && renameValue.trim()) void rename(renameId, renameValue.trim()); setRenameId(null); }}>
          <input autoFocus value={renameValue} onChange={(event) => setRenameValue(event.target.value)} className={field} aria-label="Novo nome" />
          <div className="mt-4 flex justify-end"><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Salvar</button></div>
        </form>
      </Modal>
    </div>
  );
}

function IdeaStep() {
  const { project, update } = useApp();
  const issues = validateStep(1, project);
  const error = (path: string) => issues.find((item) => item.path === path)?.message;
  const set = (key: keyof typeof project.idea, value: string) =>
    update({ idea: { ...project.idea, [key]: value }, project: { ...project.project, name: project.idea.name, description: project.idea.description } });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className={label}>Nome do projeto
        <input className={`${field} mt-1`} value={project.idea.name} maxLength={120} onChange={(event) => set('name', event.target.value)} placeholder="Ex.: Sistema de Gestão de CFTV" />
        {error('idea.name') && <span className="text-xs text-red-500">{error('idea.name')}</span>}
      </label>
      <label className={label}>Quem vai utilizar? <span className="font-normal text-slate-400">(opcional)</span>
        <input className={`${field} mt-1`} value={project.idea.audience} onChange={(event) => set('audience', event.target.value)} placeholder="Ex.: pequenos ateliês" />
      </label>
      <label className={`${label} lg:col-span-2`}>Descrição — explique com suas próprias palavras o que você quer criar
        <textarea className={`${field} mt-1 h-32`} value={project.idea.description} maxLength={4000} onChange={(event) => set('description', event.target.value)} placeholder="Conte o que o sistema deve fazer, como ele será usado e o que você espera alcançar." />
        {error('idea.description') && <span className="text-xs text-red-500">{error('idea.description')}</span>}
      </label>
      <label className={label}>Qual problema ele resolve? <span className="font-normal text-slate-400">(opcional)</span>
        <textarea className={`${field} mt-1 h-24`} value={project.idea.problem} onChange={(event) => set('problem', event.target.value)} placeholder="Ex.: hoje perdemos tempo controlando pedidos em planilhas." />
      </label>
      <label className={label}>Quais são as principais funções? <span className="font-normal text-slate-400">(opcional)</span>
        <textarea className={`${field} mt-1 h-24`} value={project.idea.features} onChange={(event) => set('features', event.target.value)} placeholder="Liste uma por linha: cadastro de clientes, emissão de orçamentos, relatórios..." />
      </label>
      <label className={`${label} lg:col-span-2`}>Existe algum sistema semelhante? <span className="font-normal text-slate-400">(opcional)</span>
        <input className={`${field} mt-1`} value={project.idea.similar} onChange={(event) => set('similar', event.target.value)} placeholder="Ex.: algo como um CRM simples" />
      </label>
      <div className="lg:col-span-2"><InfoCard title="Não precisa saber termos técnicos">Escreva como se estivesse explicando para uma pessoa. O sistema traduz tudo para os agentes de IA.</InfoCard></div>
    </div>
  );
}

function PlatformStep() {
  const { project, update } = useApp();
  const toggle = (id: Platform) => {
    const platforms = project.platforms.includes(id) ? project.platforms.filter((item) => item !== id) : [...project.platforms, id];
    update({ platforms });
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLATFORMS.map((item) => (
        <OptionCard key={item.id} title={item.label} description={item.description} icon={item.icon}
          selected={project.platforms.includes(item.id)} onClick={() => toggle(item.id)} />
      ))}
      <OptionCard title="Multiplataforma" description="Web + PWA + Desktop em um único projeto." icon="🚀"
        selected={['web', 'pwa', 'desktop'].every((id) => project.platforms.includes(id as Platform))}
        onClick={() => update({ platforms: ['web', 'pwa', 'desktop'] })} />
      <div className="sm:col-span-4"><PlatformHint selected={project.platforms} /></div>
      {validateStep(2, project).length > 0 && <div className="sm:col-span-2"><p className="text-sm text-red-500">Selecione ao menos uma plataforma.</p></div>}
    </div>
  );
}

function EngineeringStep() {
  const { project, update } = useApp();
  const [filter, setFilter] = useState<'all' | 'essential' | 'advanced'>('all');
  const options = ENGINES.filter((option) => filter === 'all' || (filter === 'essential' ? option.recommendedLevel <= 2 : option.recommendedLevel >= 4));
  const toggle = (key: keyof Engineering, value: boolean) => update({ engineering: { ...project.engineering, [key]: value } });
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'essential', 'advanced'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-xs ${filter === item ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
            {item === 'all' ? 'Todas' : item === 'essential' ? 'Essenciais' : 'Avançadas'}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {options.map((option) => (
          <ToggleOption key={option.id} checked={project.engineering[option.id]} title={option.label} description={option.description}
            technical={option.technical} explanation={option.explanation} tooltip={option.tooltip} impact={option.impact} icon={option.icon}
            onChange={(value) => toggle(option.id, value)} />
        ))}
      </div>
    </div>
  );
}

function PowerStep() {
  const { project, update } = useApp();
  const report = useMemo(() => analyzeCoherence(project), [project]);
  return (
    <div className="space-y-6">
      <LevelSelector value={project.project.level} onChange={(level: PowerLevel) => update({ project: { ...project.project, level } })} />
      <InfoCard title={`Nível ${project.project.level}: ${getLevel(project.project.level).name}`}>{getLevel(project.project.level).description}</InfoCard>
      <ConsistencyAlert report={report} onAction={(actionId, suggested) => {
        const patched = applyCoherenceAction(project, actionId, suggested);
        update(patched);
      }} />
      {report.coherent && report.warnings.length === 0 && <SuccessState message="Configuração coerente. Nenhum conflito detectado." />}
    </div>
  );
}

function ReviewStep() {
  const { project, goTo } = useApp();
  const report = useMemo(() => analyzeCoherence(project), [project]);
  const rows: Array<[string, string]> = [
    ['Projeto', project.project.name || '—'],
    ['Descrição', project.idea.description || '—'],
    ['Plataformas', project.platforms.join(', ') || '—'],
    ['Nível', `${project.project.level} — ${getLevel(project.project.level).name}`],
    ['Banco de dados', project.database.enabled ? project.database.engine : 'Não'],
    ['Autenticação', project.authentication.enabled ? 'Sim' : 'Não'],
    ['Testes', project.testing.enabled ? 'Sim' : 'Não'],
    ['Git', project.git.enabled ? 'Sim' : 'Não'],
    ['CI/CD', project.deployment.cicd ? 'Sim' : 'Não'],
    ['Segurança', project.engineering.security ? 'Sim' : 'Não'],
  ];
  return (
    <div className="space-y-6">
      <ConsistencyAlert report={report} onAction={(actionId, suggested) => updateAction(project, actionId, suggested)} />
      <dl className="grid gap-2 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        {rows.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm dark:border-slate-800">
            <dt className="text-slate-500">{key}</dt><dd className="max-w-[65%] break-words text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        {WIZARD_STEPS.slice(0, 4).map((step) => (
          <button key={step.id} type="button" onClick={() => goTo(step.id)} className="rounded-lg bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">Editar {step.title}</button>
        ))}
      </div>
    </div>
  );

  function updateAction(state: typeof project, actionId: string, suggested?: PowerLevel) {
    useApp.getState().update(applyCoherenceAction(state, actionId, suggested));
  }
}

function ResultView() {
  const { project, update, regenerate, generate, exportAs, goTo } = useApp();
  const started = useRef(false);
  useEffect(() => {
    if (!project.generatedPrompt && !started.current) {
      started.current = true;
      void generate().finally(() => { started.current = false; });
    }
  }, [project.generatedPrompt, generate]);
  return (
    <div className="po-fade space-y-6">
      <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950/40">
        <h2 className="text-2xl font-bold">🚀 Seu projeto está pronto</h2>
        <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          <li>✓ Requisitos analisados</li><li>✓ Configurações validadas</li>
          <li>✓ Arquitetura definida</li><li>✓ Prompt gerado</li>
        </ul>
      </section>
      {!project.generatedPrompt && <LoadingState label="Gerando especificação e prompt…" />}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <PromptEditor value={project.generatedPrompt} onChange={(value) => update({ generatedPrompt: value })}
          onRegenerate={() => void regenerate()} onEditConfig={() => goTo(1)} fileName={project.project.name || 'prompt'} />
        <div className="space-y-4">
          <HowToUse />
          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
            <h3 className="font-semibold">Exportar projeto completo</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['json', 'yaml', 'md', 'txt'] as const).map((format) => (
                <button key={format} type="button" onClick={() => void exportAs(format)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs uppercase dark:bg-slate-700">{format}</button>
              ))}
            </div>
            <button type="button" onClick={() => void generate()} className="mt-3 text-xs text-indigo-600 underline dark:text-indigo-400">Gerar novamente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView() {
  const { versions, restoreVersion, dropVersion, openProject } = useApp();
  if (!versions.length) return <EmptyState title="Nenhuma versão salva" description="Versões são criadas automaticamente ao gerar o prompt." />;
  return (
    <ul className="space-y-3">
      {versions.map((version) => (
        <li key={version.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div><p className="font-semibold">{version.label}</p><p className="text-xs text-slate-500">{new Date(version.createdAt).toLocaleString('pt-BR')} · {version.state.generatedPrompt.length} caracteres</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void restoreVersion(version.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">Restaurar</button>
            <button type="button" onClick={() => void openProject(version.projectId)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">Ver projeto</button>
            <button type="button" onClick={() => { if (window.confirm('Excluir esta versão?')) void dropVersion(version.id); }} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">Excluir</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WizardView() {
  const { project, goTo, next, back, saveNow, generate, busy, update, toast, notify } = useApp();
  const step = project.metadata.step;
  const current = WIZARD_STEPS.find((item) => item.id === step) ?? WIZARD_STEPS[0];
  const percent = (step / WIZARD_STEPS.length) * 100;

  return (
    <div className="po-fade">
      <ProgressBar step={step} percent={percent} />
      <div className="mt-6">
        <WizardStepView title={current.title.charAt(0).toUpperCase() + current.title.slice(1)} description={current.description}>
          {step === 1 && <IdeaStep />}
          {step === 2 && <PlatformStep />}
          {step === 3 && <EngineeringStep />}
          {step === 4 && <PowerStep />}
          {step === 5 && <ReviewStep />}
          {step === 6 && <ResultView />}
        </WizardStepView>
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <div className="flex gap-2">
          <button type="button" onClick={back} disabled={step === 1} className="rounded-lg bg-slate-200 px-4 py-2 text-sm disabled:opacity-40 dark:bg-slate-700">← Voltar</button>
          <button type="button" onClick={() => void saveNow()} className="rounded-lg bg-slate-200 px-4 py-2 text-sm dark:bg-slate-700">Salvar</button>
          <button type="button" onClick={() => { goTo(1); update({}); useApp.setState({ view: 'home' }); }} className="rounded-lg bg-slate-200 px-4 py-2 text-sm dark:bg-slate-700">Sair</button>
        </div>
        {step < 6 ? (
          <button type="button" onClick={() => { const error = next(); if (error) notify(error); }} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white">Continuar →</button>
        ) : (
          <button type="button" onClick={() => void generate()} disabled={busy} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? 'Gerando…' : 'Gerar novamente'}</button>
        )}
      </footer>
      {toast && <Toast message={toast} onClose={() => notify(null)} />}
    </div>
  );
}

export default function App() {
  const { view, project, init, theme, toggleTheme, toast, notify } = useApp();
  useEffect(() => { void init(); }, [init]);

  const title = view === 'home' ? 'Início' : view === 'result' ? 'Resultado' : view === 'history' ? 'Histórico' : `Etapa ${project.metadata.step} — ${WIZARD_STEPS[project.metadata.step - 1]?.title ?? ''}`;

  return (
    <AppShell
      topBar={<TopBar title={title} subtitle="Prompt Orchestrator"
        actions={<>
          <span className="hidden text-xs text-slate-400 sm:inline">Salvamento automático ativo</span>
          <button type="button" onClick={toggleTheme} className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm dark:bg-slate-700" aria-label="Alternar tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button type="button" onClick={() => useApp.setState({ view: 'home' })} className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm dark:bg-slate-700">Início</button>
        </>} />}
      sidebar={<Sidebar active={view}
        items={[{ id: 'home', label: 'Início', icon: '🏠' }, { id: 'wizard', label: 'Novo projeto', icon: '➕' }, { id: 'result', label: 'Resultado', icon: '✨' }, { id: 'history', label: 'Histórico', icon: '🕒' }]}
        onSelect={(id) => useApp.setState({ view: id as typeof view })} />}
    >
      {view === 'home' && <HomeView />}
      {view === 'wizard' && <WizardView />}
      {view === 'result' && <ResultView />}
      {view === 'history' && <HistoryView />}
      {toast && view !== 'wizard' && <Toast message={toast} onClose={() => notify(null)} />}
    </AppShell>
  );
}
