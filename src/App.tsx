import "./App.css";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { HighlightCards } from "./presentation/components/HighlightCards";
import { RepositoryDashboards } from "./presentation/components/RepositoryDashboards";
import { RouteLinks } from "./presentation/components/RouteLinks";
import { SectionBlock } from "./presentation/components/SectionBlock";
import { SkillMatrix } from "./presentation/components/SkillMatrix";
import { useLandingViewModel } from "./presentation/hooks/useLandingViewModel";

const windReactiveSelector =
  ".top-nav, .hero, .section-block, .footer-note, .dashboard-card, .highlight-card, .experience-card, .route-card, .skill-card, .volunteer-card";
const windOrbSelector = ".orb";

function useWindMotion() {
  const shellRef = useRef<HTMLElement | null>(null);
  const reactiveAnimationsRef = useRef(new Map<HTMLElement, Animation>());
  const orbAnimationsRef = useRef(new Map<HTMLElement, Animation>());
  const settleTimeoutRef = useRef<number | null>(null);
  const accumulatedMotionRef = useRef(0);
  const activeUntilRef = useRef(0);
  const lastEnergyRef = useRef(0);
  const lastTriggerRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );

    if (!mediaQuery) {
      return () => undefined;
    }

    const syncPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    syncPreference();
    mediaQuery.addEventListener?.("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener?.("change", syncPreference);

      if (settleTimeoutRef.current !== null) {
        globalThis.clearTimeout(settleTimeoutRef.current);
      }

      reactiveAnimationsRef.current.forEach((animation) => animation.cancel());
      orbAnimationsRef.current.forEach((animation) => animation.cancel());
    };
  }, []);

  const settleWind = useEffectEvent(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    shell.style.setProperty("--wind-x", "0px");
    shell.style.setProperty("--wind-y", "0px");
    shell.style.setProperty("--wind-tilt", "0deg");
    shell.style.setProperty("--wind-energy", "0");
  });

  const animateWind = useEffectEvent(
    (
      clientX: number,
      clientY: number,
      movementX: number,
      movementY: number,
    ) => {
      const shell = shellRef.current;

      if (!shell || reducedMotionRef.current) {
        return;
      }

      const now = globalThis.performance.now();

      const rect = shell.getBoundingClientRect();
      const normalizedX = (clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (clientY - rect.top) / rect.height - 0.5;
      const kineticEnergy = Math.min(
        1,
        Math.hypot(normalizedX, normalizedY) * 1.7 +
          (Math.abs(movementX) + Math.abs(movementY)) / 28,
      );

      const minimumCooldown = now - lastTriggerRef.current < 288;
      const inActiveCycle = now < activeUntilRef.current;
      const strongerGust = kineticEnergy > lastEnergyRef.current * 1.22;

      if (
        (minimumCooldown && kineticEnergy < 0.86) ||
        (inActiveCycle && !strongerGust)
      ) {
        return;
      }

      lastTriggerRef.current = now;
      lastEnergyRef.current = kineticEnergy;

      const windX = normalizedX * (22 + kineticEnergy * 14);
      const windY = normalizedY * (12 + kineticEnergy * 9);
      const windTilt = normalizedX * (3.8 + kineticEnergy * 3.1);

      shell.style.setProperty("--wind-x", `${windX.toFixed(2)}px`);
      shell.style.setProperty("--wind-y", `${windY.toFixed(2)}px`);
      shell.style.setProperty("--wind-tilt", `${windTilt.toFixed(2)}deg`);
      shell.style.setProperty("--wind-energy", kineticEnergy.toFixed(3));

      const reactiveElements =
        shell.querySelectorAll<HTMLElement>(windReactiveSelector);

      reactiveElements.forEach((element, index) => {
        reactiveAnimationsRef.current.get(element)?.cancel();

        const damping = Math.max(0.46, 1 - index * 0.07);
        const animation = element.animate(
          [
            { transform: "translate3d(0, 0, 0) rotate(0deg)" },
            {
              offset: 0.28,
              transform: `translate3d(${(windX * damping).toFixed(2)}px, ${(windY * 0.42 * damping).toFixed(2)}px, 0) rotate(${(windTilt * damping).toFixed(2)}deg)`,
            },
            {
              offset: 0.62,
              transform: `translate3d(${(-windX * 0.55 * damping).toFixed(2)}px, ${(-windY * 0.16 * damping).toFixed(2)}px, 0) rotate(${(-windTilt * 0.48 * damping).toFixed(2)}deg)`,
            },
            { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          ],
          {
            duration: 1200 + index * 35 + kineticEnergy * 240,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );

        reactiveAnimationsRef.current.set(element, animation);
      });

      const orbElements = shell.querySelectorAll<HTMLElement>(windOrbSelector);

      orbElements.forEach((element, index) => {
        orbAnimationsRef.current.get(element)?.cancel();

        const damping = 1 + index * 0.18;
        const animation = element.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1)" },
            {
              offset: 0.35,
              transform: `translate3d(${(windX * 1.4 * damping).toFixed(2)}px, ${(windY * 0.72 * damping).toFixed(2)}px, 0) scale(${(1.03 + kineticEnergy * 0.08).toFixed(3)})`,
            },
            {
              offset: 0.68,
              transform: `translate3d(${(-windX * 0.85 * damping).toFixed(2)}px, ${(-windY * 0.24 * damping).toFixed(2)}px, 0) scale(${(0.98 + kineticEnergy * 0.04).toFixed(3)})`,
            },
            { transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: 1700 + index * 110 + kineticEnergy * 300,
            easing: "cubic-bezier(0.2, 0.9, 0.24, 1)",
            fill: "both",
          },
        );

        orbAnimationsRef.current.set(element, animation);
      });

      if (settleTimeoutRef.current !== null) {
        globalThis.clearTimeout(settleTimeoutRef.current);
      }

      settleTimeoutRef.current = globalThis.setTimeout(() => {
        settleWind();
      }, 1420);

      activeUntilRef.current = now + 1200 + kineticEnergy * 380;
    },
  );

  const handlePointerMove = useEffectEvent(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") {
        return;
      }

      accumulatedMotionRef.current += Math.hypot(
        event.movementX,
        event.movementY,
      );

      if (accumulatedMotionRef.current < 15) {
        return;
      }

      accumulatedMotionRef.current = 0;

      animateWind(
        event.clientX,
        event.clientY,
        event.movementX,
        event.movementY,
      );
    },
  );

  const handlePointerLeave = useEffectEvent(() => {
    accumulatedMotionRef.current = 0;
    settleWind();
  });

  return {
    shellRef,
    handlePointerLeave,
    handlePointerMove,
  };
}

function App() {
  const viewModel = useLandingViewModel();
  const { shellRef, handlePointerLeave, handlePointerMove } = useWindMotion();

  return (
    <main
      ref={shellRef}
      className="app-shell"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div className="living-atmosphere" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="gust gust-a" />
        <span className="gust gust-b" />
      </div>

      <nav className="top-nav" aria-label="Navegação da página">
        <a href="#sobre">Sobre</a>
        <a href="#carreira">Carreira</a>
        <a href="#dashboards">Dashboards</a>
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

        <div
          className="experience-grid"
          aria-label="Experiências profissionais"
        >
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
        id="dashboards"
        kicker="Organismo vivo"
        title="Dashboards dinâmicos dos repositórios"
        description="Métricas em tempo real para acompanhar pulso técnico, atividade e tração de cada superfície do ecossistema."
      >
        <RepositoryDashboards repositories={viewModel.repositoryDashboards} />
      </SectionBlock>

      <SectionBlock
        id="hard-skills"
        kicker="Competências técnicas"
        title="Hard Skills"
        description="Tecnologias e capacidades técnicas aplicadas no dia a dia para entregar estabilidade, escala e evolução segura."
      >
        <SkillMatrix skills={viewModel.hardSkills} />
      </SectionBlock>

      <SectionBlock
        id="soft-skills"
        kicker="Competências comportamentais"
        title="Soft Skills"
        description="Habilidades interpessoais que sustentam liderança técnica, alinhamento de time e entrega consistente."
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
            <h3>Qualidades reforçadas no escotismo</h3>
            <ul className="volunteer-list">
              {viewModel.volunteering.qualitiesApplied.map((quality) => (
                <li key={quality}>{quality}</li>
              ))}
            </ul>
          </article>

          <article className="volunteer-card">
            <h3>Benefícios diretos no ambiente de trabalho</h3>
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
        kicker="Próximos passos"
        title="Rotas objetivas para avaliação profissional"
        description="A página raiz apresenta quem sou e direciona para as superfícies de aprofundamento sem redundância."
      >
        <RouteLinks routes={viewModel.routes} />
      </SectionBlock>

      <footer className="footer-note">
        Esta SPA foi redesenhada para manter o escopo original do root gateway,
        com UX alinhada ao ecossistema DataCrash Profile e Professional Hub.
      </footer>
    </main>
  );
}

export default App;
