import { useEffect, useRef, useState } from "react";
import "./App.css";

type RepositorySignalSeed = {
  index: string;
  label: string;
  title: string;
  description: string;
  href: string;
  repository: string;
};

type RepositorySignalLive = {
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  updatedAtLabel: string;
};

const repositorySignals: RepositorySignalSeed[] = [
  {
    index: "01",
    label: "Root domain",
    title: "datacrash.github.io",
    description:
      "Camada de entrada com roteamento rápido, presença visual e prova operacional.",
    href: "https://datacrash.github.io/",
    repository: "datacrash.github.io",
  },
  {
    index: "02",
    label: "Hub premium",
    title: "professional-hub",
    description:
      "Dashboard técnico, storytelling profissional, privacidade e CVs em fluxo curto.",
    href: "https://datacrash.github.io/professional-hub/",
    repository: "professional-hub",
  },
  {
    index: "03",
    label: "GitHub profile",
    title: "datacrash",
    description:
      "README animado, sinais públicos e identidade complementar ao domínio raiz.",
    href: "https://github.com/DataCrash",
    repository: "datacrash",
  },
];

const signalArtifacts = [
  "CV PT-BR orientado a triagem local",
  "Resume EN para posição internacional",
  "LinkedIn como validação pública complementar",
  "README e animacao do perfil como camada viva",
];

const hiringRoutes = [
  {
    index: "01",
    label: "Mercado BR",
    title: "Curriculo PT-BR",
    href: "https://datacrash.github.io/professional-hub/#/cv-ptbr",
    note: "Leitura curta para recrutamento local e lideranca tecnica.",
  },
  {
    index: "02",
    label: "Mercado Global",
    title: "Resume EN",
    href: "https://datacrash.github.io/professional-hub/#/cv-en",
    note: "Versao enxuta para avaliacao internacional e remota.",
  },
  {
    index: "03",
    label: "Validacao publica",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/datacrash/",
    note: "Contexto de carreira, networking e coerencia publica.",
  },
];

const decisionVectors = [
  {
    index: "01",
    title: "Leitura executiva",
    description:
      "O hub entrega narrativa, profundidade tecnica e contexto de lideranca em fluxo curto.",
  },
  {
    index: "02",
    title: "Triagem objetiva",
    description:
      "CV PT-BR e Resume EN ficam acessiveis sem obrigar o leitor a navegar demais.",
  },
  {
    index: "03",
    title: "Validacao publica",
    description:
      "GitHub e LinkedIn fecham a leitura com identidade, historico e sinais publicos coerentes.",
  },
];

const snakePreviewUrl =
  "https://raw.githubusercontent.com/DataCrash/datacrash/output/github-contribution-grid-snake-dark.svg";

function formatRepositoryDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "atualizacao indisponivel";
  }

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function App() {
  const shellRef = useRef<HTMLElement | null>(null);
  const [liveRepositorySignals, setLiveRepositorySignals] = useState<
    Record<string, RepositorySignalLive>
  >({});

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = shell.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const percentX = (x / bounds.width) * 100;
      const percentY = (y / bounds.height) * 100;
      const tiltY = (x / bounds.width - 0.5) * 8;
      const tiltX = (0.5 - y / bounds.height) * 6;

      shell.style.setProperty("--mx", `${percentX}%`);
      shell.style.setProperty("--my", `${percentY}%`);
      shell.style.setProperty("--tilt-x", `${tiltX}`);
      shell.style.setProperty("--tilt-y", `${tiltY}`);
    };

    const resetPointer = () => {
      shell.style.setProperty("--mx", "50%");
      shell.style.setProperty("--my", "18%");
      shell.style.setProperty("--tilt-x", "0");
      shell.style.setProperty("--tilt-y", "0");
    };

    resetPointer();
    shell.addEventListener("pointermove", handlePointerMove);
    shell.addEventListener("pointerleave", resetPointer);

    return () => {
      shell.removeEventListener("pointermove", handlePointerMove);
      shell.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepositorySignals() {
      const responses = await Promise.allSettled(
        repositorySignals.map(async (signal) => {
          const response = await fetch(
            `https://api.github.com/repos/DataCrash/${signal.repository}`,
            {
              headers: {
                Accept: "application/vnd.github+json",
              },
              signal: controller.signal,
            },
          );

          if (!response.ok) {
            throw new Error(`GitHub API ${response.status}`);
          }

          const payload = (await response.json()) as {
            stargazers_count?: number;
            forks_count?: number;
            open_issues_count?: number;
            language?: string | null;
            updated_at?: string;
          };

          return {
            key: signal.repository,
            value: {
              stars: payload.stargazers_count ?? 0,
              forks: payload.forks_count ?? 0,
              openIssues: payload.open_issues_count ?? 0,
              language: payload.language ?? "mixed",
              updatedAtLabel: payload.updated_at
                ? formatRepositoryDate(payload.updated_at)
                : "indisponivel",
            },
          };
        }),
      );

      if (controller.signal.aborted) {
        return;
      }

      const nextState = responses.reduce<Record<string, RepositorySignalLive>>(
        (accumulator, response) => {
          if (response.status === "fulfilled") {
            accumulator[response.value.key] = response.value.value;
          }

          return accumulator;
        },
        {},
      );

      setLiveRepositorySignals(nextState);
    }

    loadRepositorySignals().catch(() => {
      if (!controller.signal.aborted) {
        setLiveRepositorySignals({});
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="shell" ref={shellRef}>
      <div className="cursor-veil" aria-hidden="true" />
      <div className="forming-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="topbar" aria-label="Status do domínio raiz">
        <span>Root Entry</span>
        <span>GitHub Actions Live</span>
        <span>Professional Signal Online</span>
      </section>

      <section className="transmission-band" aria-label="Transmissão ativa">
        <div className="transmission-track">
          <span>datacrash</span>
          <span>root gateway</span>
          <span>professional hub</span>
          <span>signal routing</span>
          <span>currículo pt-br</span>
          <span>resume en</span>
          <span>linkedin</span>
          <span>github profile</span>
          <span>datacrash</span>
          <span>root gateway</span>
          <span>professional hub</span>
          <span>signal routing</span>
        </div>
      </section>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="hero-stack">
            <p className="eyebrow">datacrash.github.io</p>
            <div className="hero-alert">
              <span className="hero-ping" aria-hidden="true" />
              <span>
                Entrada primária para avaliação técnica e narrativa profissional
              </span>
            </div>
            <h1>Arquitetura, impacto visual e sinal profissional.</h1>
            <p className="lede">
              Presença raiz do ecossistema DataCrash. O objetivo aqui não é
              listar tudo. É direcionar rápido para o que importa: narrativa
              profissional, profundidade técnica e conversão em contato.
            </p>

            <div className="hero-flow" aria-label="Fluxo de leitura principal">
              <article>
                <span className="metric-label">Entrada</span>
                <strong>Root gateway com leitura curta</strong>
              </article>
              <article>
                <span className="metric-label">Leitura</span>
                <strong>Provas, repositórios e CVs em sequência</strong>
              </article>
              <article>
                <span className="metric-label">Saída</span>
                <strong>Hub, perfil público e contato sem ruído</strong>
              </article>
            </div>

            <div className="hero-metrics" aria-label="Indicadores principais">
              <div>
                <span className="metric-label">Modo</span>
                <strong>Root Gateway</strong>
              </div>
              <div>
                <span className="metric-label">Deploy</span>
                <strong>GitHub Pages + Actions</strong>
              </div>
              <div>
                <span className="metric-label">Tráfego</span>
                <strong>Hub, CVs, GitHub, LinkedIn</strong>
              </div>
            </div>

            <div className="cta-row">
              <a
                className="primary-link"
                href="https://datacrash.github.io/professional-hub/"
                target="_blank"
                rel="noreferrer"
              >
                Abrir Professional Hub
              </a>
              <a
                className="secondary-link"
                href="https://github.com/DataCrash"
                target="_blank"
                rel="noreferrer"
              >
                Abrir perfil GitHub
              </a>
            </div>
          </div>
        </div>

        <aside className="signal-panel" aria-label="Resumo profissional">
          <p className="panel-label">Signal Board</p>
          <div className="signal-summary">
            <div>
              <span className="metric-label">Estado</span>
              <strong>Presença ativa e roteada</strong>
            </div>
            <p>
              Hub, perfil, CVs e domínio raiz funcionando como um mesmo sistema.
            </p>
          </div>

          <div className="signal-row">
            <span>Nome</span>
            <strong>Alessandro Ferreira Pereira</strong>
          </div>
          <div className="signal-row">
            <span>Foco</span>
            <strong>.NET, arquitetura e modernização</strong>
          </div>
          <div className="signal-row">
            <span>Base</span>
            <strong>São Paulo, Brasil</strong>
          </div>
          <div className="signal-row">
            <span>Destino</span>
            <strong>Hub, CV PT-BR, CV EN, GitHub</strong>
          </div>

          <div className="signal-cluster" aria-label="Sinais operacionais">
            <article>
              <span className="metric-label">Repositórios</span>
              <strong>3 superfícies conectadas</strong>
            </article>
            <article>
              <span className="metric-label">CVs</span>
              <strong>PT-BR + EN prontos</strong>
            </article>
            <article>
              <span className="metric-label">Perfil</span>
              <strong>README vivo + sinais ativos</strong>
            </article>
          </div>

          <div className="signal-feed" aria-label="Fluxo de sinal">
            <div className="signal-feed-header">
              <span className="metric-label">Pulse Feed</span>
              <span className="feed-badge">Live routing</span>
            </div>

            <article className="feed-item">
              <span className="feed-index">01</span>
              <div>
                <strong>Root gateway</strong>
                <p>
                  Primeira leitura visual, prova operacional e rotas curtas.
                </p>
              </div>
            </article>

            <article className="feed-item">
              <span className="feed-index">02</span>
              <div>
                <strong>Professional hub</strong>
                <p>
                  Dashboard técnico, narrativa profissional e privacidade clara.
                </p>
              </div>
            </article>

            <article className="feed-item">
              <span className="feed-index">03</span>
              <div>
                <strong>CV + GitHub profile</strong>
                <p>
                  Currículos, validação pública e ativos de confiança técnica.
                </p>
              </div>
            </article>
          </div>
        </aside>
      </section>

      <section className="proof-strip" aria-label="Prova operacional">
        <div className="proof-card">
          <span className="proof-index">01</span>
          <strong>Hub premium publicado</strong>
          <p>
            Narrativa, dashboard, CVs e privacidade já expostos no domínio
            público.
          </p>
        </div>
        <div className="proof-card">
          <span className="proof-index">02</span>
          <strong>Perfil GitHub ativo</strong>
          <p>
            A identidade pública já conversa com o restante do ecossistema sem
            parecer uma peça isolada.
          </p>
        </div>
        <div className="proof-card">
          <span className="proof-index">03</span>
          <strong>Deploy por Actions validado</strong>
          <p>
            O domínio raiz mantém publicação própria, previsível e alinhada ao
            fluxo de atualização.
          </p>
        </div>
      </section>

      <section className="assembly-map" aria-label="Interface em formação">
        <div className="assembly-copy">
          <p className="eyebrow">Interface em formação</p>
          <h2>
            Uma navegação com cara de sistema vivo, não de vitrine estática.
          </h2>
          <p>
            O domínio raiz passa a se comportar como um roteador de sinal: cada
            bloco responde ao movimento, reforça contexto e prepara a transição
            para o hub principal sem poluir a leitura.
          </p>
        </div>

        <div className="assembly-lane">
          <article className="assembly-node">
            <span className="assembly-step">01</span>
            <h3>Entrada</h3>
            <p>
              GitHub, LinkedIn e referências convergem para um ponto inicial
              comum.
            </p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node assembly-node-accent">
            <span className="assembly-step">02</span>
            <h3>Leitura de sinal</h3>
            <p>
              Headline, provas operacionais e rotas-chave aparecem antes do
              excesso.
            </p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node">
            <span className="assembly-step">03</span>
            <h3>Aprofundamento</h3>
            <p>
              O tráfego é empurrado para CVs, dashboard e ativos de confiança
              técnica.
            </p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
        </div>
      </section>

      <section
        className="surface-grid"
        aria-label="Sinais vivos do ecossistema"
      >
        <div className="surface-panel">
          <div className="surface-panel-head">
            <p className="eyebrow">Repo Relay</p>
            <span className="feed-badge">
              {Object.keys(liveRepositorySignals).length ===
              repositorySignals.length
                ? "Live data"
                : "Fallback mode"}
            </span>
          </div>
          <h2>
            Repositórios com função clara e sinais públicos em tempo de leitura.
          </h2>
          <p>
            Esta faixa deixa de ser apenas conceitual: o root passa a expor
            metadados públicos do GitHub e mostra como cada superfície participa
            do ecossistema.
          </p>

          <div className="relay-lane">
            {repositorySignals.map((signal) =>
              (() => {
                const liveSignal = liveRepositorySignals[signal.repository];

                return (
                  <a
                    key={signal.title}
                    className="relay-card"
                    href={signal.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="relay-index">{signal.index}</span>
                    <span className="route-kicker">{signal.label}</span>
                    <strong>{signal.title}</strong>
                    <p>{signal.description}</p>

                    <div
                      className="relay-meta"
                      aria-label={`Metadados de ${signal.title}`}
                    >
                      <span>
                        {liveSignal
                          ? `${liveSignal.stars} stars`
                          : "surface active"}
                      </span>
                      <span>
                        {liveSignal
                          ? `${liveSignal.forks} forks`
                          : "repo linked"}
                      </span>
                      <span>
                        {liveSignal
                          ? `${liveSignal.language.toLowerCase()} core`
                          : "public signal"}
                      </span>
                    </div>

                    <div className="relay-foot">
                      <span>
                        {liveSignal
                          ? `${liveSignal.openIssues} issues abertas`
                          : "metadados publicos"}
                      </span>
                      <span>
                        {liveSignal
                          ? `update ${liveSignal.updatedAtLabel}`
                          : "fallback visual"}
                      </span>
                    </div>
                  </a>
                );
              })(),
            )}
          </div>
        </div>

        <div className="surface-panel surface-panel-accent">
          <div className="surface-panel-head">
            <p className="eyebrow">CV Signal</p>
            <span className="feed-badge">Live preview</span>
          </div>
          <h2>Rotas de contratacao com prova viva acoplada ao perfil.</h2>
          <p>
            Em vez de listar ativos soltos, a home passa a organizar as rotas de
            avaliacao e ainda expor uma camada viva do perfil GitHub para provar
            manutencao e atividade visual no mesmo ecossistema.
          </p>

          <div
            className="artifact-rail"
            aria-label="Rotas principais de contratacao"
          >
            {hiringRoutes.map((route) => (
              <a
                key={route.title}
                className="artifact-route"
                href={route.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="artifact-bullet">{route.index}</span>
                <div>
                  <span className="route-kicker">{route.label}</span>
                  <strong>{route.title}</strong>
                  <p>{route.note}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="signal-preview" aria-label="Preview do perfil GitHub">
            <div className="signal-preview-head">
              <div>
                <span className="metric-label">Profile Pulse</span>
                <strong>Profile pulse embedded</strong>
              </div>
              <span className="feed-badge">Synced from profile repo</span>
            </div>

            <div className="signal-preview-frame">
              <img
                src={snakePreviewUrl}
                alt="Snake de contribuicoes do perfil DataCrash"
              />
            </div>

            <div className="artifact-list" aria-label="Ativos complementares">
              {signalArtifacts.map((artifact, index) => (
                <article key={artifact} className="artifact-item">
                  <span className="artifact-bullet">0{index + 1}</span>
                  <p>{artifact}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="routes-stage" aria-label="Rotas principais">
        <div className="routes-intro">
          <p className="eyebrow">Routing layer</p>
          <h2>As saídas finais precisam parecer escolhas, não só links.</h2>
          <p>
            Esta faixa organiza a decisão final de leitura: aprofundar no hub,
            abrir o currículo certo para o contexto ou validar rapidamente a
            presença pública complementar.
          </p>
        </div>

        <div className="routes">
          <a
            className="route-card route-card-featured"
            href="https://datacrash.github.io/professional-hub/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">Rota principal</span>
            <h2>Professional Hub</h2>
            <p>
              Dashboard, storytelling técnico, privacidade clara e experiência
              premium.
            </p>
          </a>

          <a
            className="route-card"
            href="https://datacrash.github.io/professional-hub/#/cv-ptbr"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">Mercado BR</span>
            <h2>Currículo PT-BR</h2>
            <p>
              Versão orientada a recrutadores, gestão técnica e avaliação de fit
              local.
            </p>
          </a>

          <a
            className="route-card"
            href="https://datacrash.github.io/professional-hub/#/cv-en"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">Mercado global</span>
            <h2>Resume EN</h2>
            <p>
              Resumo enxuto para posições internacionais, remotas e de senioridade
              alta.
            </p>
          </a>

          <a
            className="route-card"
            href="https://www.linkedin.com/in/datacrash/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">Rede profissional</span>
            <h2>LinkedIn</h2>
            <p>
              Contexto de carreira, networking e validação pública complementar.
            </p>
          </a>
        </div>
      </section>

      <section className="closing-grid" aria-label="Fechamento da jornada">
        <div className="closing-panel closing-panel-primary">
          <p className="eyebrow">Próximo passo</p>
          <h2>Menos ruído, mais intenção e uma saída final mais forte.</h2>
          <p>
            O domínio raiz precisa terminar com a mesma clareza com que começa:
            uma leitura curta, uma direção explícita e saídas que convertam sem
            parecer improvisadas.
          </p>

          <div className="closing-actions">
            <a
              className="primary-link"
              href="https://datacrash.github.io/professional-hub/"
              target="_blank"
              rel="noreferrer"
            >
              Continuar no Professional Hub
            </a>
            <a
              className="secondary-link"
              href="https://github.com/DataCrash"
              target="_blank"
              rel="noreferrer"
            >
              Validar perfil publico
            </a>
          </div>
        </div>

        <div className="closing-panel closing-panel-secondary">
          <div className="surface-panel-head">
            <p className="eyebrow">Decision vectors</p>
            <span className="feed-badge">Final routing</span>
          </div>

          <div
            className="decision-list"
            aria-label="Caminhos finais de avaliacao"
          >
            {decisionVectors.map((item) => (
              <article key={item.index} className="decision-card">
                <span className="decision-index">{item.index}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="closing-note">
        <span>DataCrash</span>
        <span>Forward-only delivery</span>
        <span>Root domain operational</span>
      </footer>
    </main>
  );
}

export default App;
