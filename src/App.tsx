import "./App.css";

import { HighlightCards } from "./presentation/components/HighlightCards";
import { RouteLinks } from "./presentation/components/RouteLinks";
import { SectionBlock } from "./presentation/components/SectionBlock";
import { SkillMatrix } from "./presentation/components/SkillMatrix";
import { useLandingViewModel } from "./presentation/hooks/useLandingViewModel";

function App() {
  const viewModel = useLandingViewModel();

  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="Navegacao da pagina">
        <a href="#sobre">Sobre</a>
        <a href="#carreira">Carreira</a>
        <a href="#hard-skills">Hard Skills</a>
        <a href="#soft-skills">Soft Skills</a>
        <a href="#escotismo">Escotismo</a>
        <a href="#rotas">Rotas</a>
      </nav>

      <header className="hero" id="sobre">
        <p className="hero-kicker">DataCrash Root Gateway</p>
        <h1>{viewModel.hero.title}</h1>
        <h2>{viewModel.hero.subtitle}</h2>
        <p className="hero-meta">{viewModel.hero.location}</p>
        <p className="hero-summary">{viewModel.hero.summary}</p>
      </header>

      <SectionBlock
        id="carreira"
        kicker="Vida profissional"
        title={viewModel.story.title}
        description={viewModel.story.summary}
      >
        <HighlightCards items={viewModel.story.highlights} />

        <div className="experience-grid" aria-label="Experiencias profissionais">
          {viewModel.experiences.map((experience) => (
            <article key={experience.company} className="experience-card">
              <h3>{experience.role}</h3>
              <p className="experience-meta">
                {experience.company} · {experience.period}
              </p>
              <p>{experience.outcome}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        id="hard-skills"
        kicker="Competencias tecnicas"
        title="Hard Skills"
        description="Tecnologias e capacidades tecnicas aplicadas no dia a dia para entregar estabilidade, escala e evolucao segura."
      >
        <SkillMatrix skills={viewModel.hardSkills} />
      </SectionBlock>

      <SectionBlock
        id="soft-skills"
        kicker="Competencias comportamentais"
        title="Soft Skills"
        description="Habilidades interpessoais que sustentam lideranca tecnica, alinhamento de time e entrega consistente."
      >
        <SkillMatrix skills={viewModel.softSkills} />
      </SectionBlock>

      <SectionBlock
        id="escotismo"
        kicker="Voluntariado"
        title={`${viewModel.volunteering.role} · ${viewModel.volunteering.organization}`}
        description={viewModel.volunteering.summary}
      >
        <div className="volunteer-grid">
          <article className="volunteer-card">
            <h3>Qualidades reforcadas no escotismo</h3>
            <ul className="volunteer-list">
              {viewModel.volunteering.qualitiesApplied.map((quality) => (
                <li key={quality}>{quality}</li>
              ))}
            </ul>
          </article>

          <article className="volunteer-card">
            <h3>Beneficios diretos no ambiente de trabalho</h3>
            <ul className="volunteer-list">
              {viewModel.volunteering.workplaceBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>
      </SectionBlock>

      <SectionBlock
        id="rotas"
        kicker="Proximos passos"
        title="Rotas objetivas para avaliacao profissional"
        description="A pagina raiz apresenta quem sou e direciona para as superficies de aprofundamento sem redundancia."
      >
        <RouteLinks routes={viewModel.routes} />
      </SectionBlock>

      <footer className="footer-note">
        Esta SPA foi redesenhada para manter o escopo original do root gateway, com UX alinhada ao ecossistema DataCrash Profile e Professional Hub.
      </footer>
    </main>
  );
}

export default App;
