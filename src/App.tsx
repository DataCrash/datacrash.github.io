import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const shellRef = useRef<HTMLElement | null>(null);

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
      const tiltY = ((x / bounds.width) - 0.5) * 8;
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
                href="https://github.com/DataCrash/datacrash"
                target="_blank"
                rel="noreferrer"
              >
                Ver README de perfil
              </a>
            </div>
          </div>
        </div>

        <aside className="signal-panel" aria-label="Resumo profissional">
          <p className="panel-label">Signal Board</p>
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
        </aside>
      </section>

      <section className="assembly-map" aria-label="Interface em formação">
        <div className="assembly-copy">
          <p className="eyebrow">Interface em formação</p>
          <h2>Uma navegação com cara de sistema vivo, não de vitrine estática.</h2>
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
            <p>GitHub, LinkedIn e referências convergem para um ponto inicial comum.</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node assembly-node-accent">
            <span className="assembly-step">02</span>
            <h3>Leitura de sinal</h3>
            <p>Headline, provas operacionais e rotas-chave aparecem antes do excesso.</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node">
            <span className="assembly-step">03</span>
            <h3>Aprofundamento</h3>
            <p>O tráfego é empurrado para CVs, dashboard e ativos de confiança técnica.</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
        </div>
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
          <strong>README de perfil ativo</strong>
          <p>
            Camada de identidade GitHub já conectada ao restante da presença
            profissional.
          </p>
        </div>
        <div className="proof-card">
          <span className="proof-index">03</span>
          <strong>Deploy por Actions validado</strong>
          <p>
            Publicação raiz corrigida para workflow próprio, sem servir fonte
            crua do branch.
          </p>
        </div>
      </section>

      <section className="routes" aria-label="Rotas principais">
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
      </section>

      <section className="manifesto">
        <div>
          <p className="eyebrow">Direção</p>
          <h2>Menos ruído, mais intenção.</h2>
        </div>
        <p>
          Este domínio raiz funciona como camada de entrada. O conteúdo profundo
          permanece concentrado no hub especializado, enquanto este ponto
          inicial entrega contexto, marca e rotas claras para quem precisa
          avaliar rápido.
        </p>
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
