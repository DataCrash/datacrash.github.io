import "./App.css";

function App() {
  return (
    <main className="shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">datacrash.github.io</p>
          <h1>Arquitetura, impacto visual e sinal profissional.</h1>
          <p className="lede">
            Presença raiz do ecossistema DataCrash. O objetivo aqui não é listar
            tudo. É direcionar rápido para o que importa: narrativa
            profissional, profundidade técnica e conversão em contato.
          </p>

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
    </main>
  );
}

export default App;
