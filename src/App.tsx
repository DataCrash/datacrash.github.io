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

type Locale = "pt-BR" | "en";

const localeStorageKey = "root-locale-v1";
const gameStorageKey = "root-signal-game-v1";
const dailyChallengeStorageKey = "root-signal-daily-v1";
const easterEggStorageKey = "root-signal-easter-v1";

type StoredGameProgress = {
  round: number;
  score: number;
  streak: number;
  bestStreak: number;
};

type GameMetric = "stars" | "forks" | "openIssues";

type StoredDailyChallenge = {
  dateKey: string;
  answered: boolean;
  hit: boolean;
  pickedRepository: string;
};

const defaultGameProgress: StoredGameProgress = {
  round: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
};

const konamiLiteSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "KeyA",
];

function readStoredGameProgress(): StoredGameProgress {
  try {
    const raw = localStorage.getItem(gameStorageKey);

    if (!raw) {
      return defaultGameProgress;
    }

    const parsed = JSON.parse(raw) as Partial<StoredGameProgress>;

    const parsedRound =
      typeof parsed.round === "number" && Number.isFinite(parsed.round)
        ? parsed.round
        : 0;
    const parsedScore =
      typeof parsed.score === "number" && Number.isFinite(parsed.score)
        ? parsed.score
        : 0;
    const parsedStreak =
      typeof parsed.streak === "number" && Number.isFinite(parsed.streak)
        ? parsed.streak
        : 0;
    const parsedBestStreak =
      typeof parsed.bestStreak === "number" && Number.isFinite(parsed.bestStreak)
        ? parsed.bestStreak
        : 0;

    return {
      round: Math.max(0, parsedRound),
      score: Math.max(0, parsedScore),
      streak: Math.max(0, parsedStreak),
      bestStreak: Math.max(0, parsedBestStreak),
    };
  } catch {
    return defaultGameProgress;
  }
}

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyMetricIndex(dateKey: string, size: number) {
  const numericSeed = dateKey
    .split("-")
    .join("")
    .split("")
    .reduce((accumulator, char) => accumulator + Number(char), 0);

  return numericSeed % size;
}

function readStoredDailyChallenge(todayDateKey: string): StoredDailyChallenge {
  try {
    const raw = localStorage.getItem(dailyChallengeStorageKey);

    if (!raw) {
      return {
        dateKey: todayDateKey,
        answered: false,
        hit: false,
        pickedRepository: "",
      };
    }

    const parsed = JSON.parse(raw) as Partial<StoredDailyChallenge>;

    if (parsed.dateKey !== todayDateKey) {
      return {
        dateKey: todayDateKey,
        answered: false,
        hit: false,
        pickedRepository: "",
      };
    }

    return {
      dateKey: todayDateKey,
      answered: parsed.answered === true,
      hit: parsed.hit === true,
      pickedRepository:
        typeof parsed.pickedRepository === "string"
          ? parsed.pickedRepository
          : "",
    };
  } catch {
    return {
      dateKey: todayDateKey,
      answered: false,
      hit: false,
      pickedRepository: "",
    };
  }
}

function readStoredEasterEggFound() {
  return localStorage.getItem(easterEggStorageKey) === "found";
}

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

const cvPtBrDownloadUrl =
  "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_BR.pdf";
const cvEnDownloadUrl =
  "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_EN.pdf";

const fallbackRepoGameMetrics: Record<
  string,
  { stars: number; forks: number; openIssues: number }
> = {
  "datacrash.github.io": { stars: 1, forks: 0, openIssues: 0 },
  "professional-hub": { stars: 2, forks: 1, openIssues: 0 },
  datacrash: { stars: 3, forks: 1, openIssues: 1 },
};

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

// eslint-disable-next-line sonarjs/cognitive-complexity
function App() {
  const shellRef = useRef<HTMLElement | null>(null);
  const todayDateKey = getTodayDateKey();
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem(localeStorageKey);
    return stored === "en" ? "en" : "pt-BR";
  });
  const [liveRepositorySignals, setLiveRepositorySignals] = useState<
    Record<string, RepositorySignalLive>
  >({});
  const [gameRound, setGameRound] = useState(
    () => readStoredGameProgress().round,
  );
  const [gameScore, setGameScore] = useState(
    () => readStoredGameProgress().score,
  );
  const [gameStreak, setGameStreak] = useState(
    () => readStoredGameProgress().streak,
  );
  const [gameBestStreak, setGameBestStreak] = useState(
    () => readStoredGameProgress().bestStreak,
  );
  const [gameFeedback, setGameFeedback] = useState("");
  const [gameLastWinningRepo, setGameLastWinningRepo] =
    useState<RepositorySignalSeed | null>(null);
  const [gameLastRoundTie, setGameLastRoundTie] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<StoredDailyChallenge>(
    () => readStoredDailyChallenge(getTodayDateKey()),
  );
  const [easterEggFound, setEasterEggFound] = useState(() =>
    readStoredEasterEggFound(),
  );
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [neonMode, setNeonMode] = useState(false);
  const [neonModeEndsAt, setNeonModeEndsAt] = useState<number | null>(null);

  const copy =
    locale === "pt-BR"
      ? {
          heroTitle: "Arquitetura, impacto visual e sinal profissional.",
          heroLede:
            "Presença raiz do ecossistema DataCrash. O objetivo aqui não é listar tudo. É direcionar rápido para o que importa: narrativa profissional, profundidade técnica e conversão em contato.",
          ctaPrimary: "Abrir Professional Hub",
          ctaSecondary: "Abrir perfil GitHub",
          priorityLabel: "Rotas prioritárias",
          cvPt: "Baixar CV PT-BR",
          cvEn: "Download CV EN",
          topStatusLabel: "Status do domínio raiz",
          transmissionLabel: "Transmissão ativa",
          heroAlert:
            "Entrada primária para avaliação técnica e narrativa profissional",
          heroFlowLabel: "Fluxo de leitura principal",
          flowEntry: "Entrada",
          flowRead: "Leitura",
          flowExit: "Saída",
          flowEntryDesc: "Root gateway com leitura curta",
          flowReadDesc: "Provas, repositórios e CVs em sequência",
          flowExitDesc: "Hub, perfil público e contato sem ruído",
          proofLabel: "Prova operacional",
          proof1Title: "Hub premium publicado",
          proof1Body:
            "Narrativa, dashboard, CVs e privacidade já expostos no domínio público.",
          proof2Title: "Perfil GitHub ativo",
          proof2Body:
            "A identidade pública já conversa com o restante do ecossistema sem parecer uma peça isolada.",
          proof3Title: "Deploy por Actions validado",
          proof3Body:
            "O domínio raiz mantém publicação própria, previsível e alinhada ao fluxo de atualização.",
          assemblyLabel: "Interface em formação",
          assemblyEyebrow: "Interface em formação",
          assemblyTitle:
            "Uma navegação com cara de sistema vivo, não de vitrine estática.",
          assemblyBody:
            "O domínio raiz passa a se comportar como um roteador de sinal: cada bloco responde ao movimento, reforça contexto e prepara a transição para o hub principal sem poluir a leitura.",
          lane1Title: "Entrada",
          lane1Body:
            "GitHub, LinkedIn e referências convergem para um ponto inicial comum.",
          lane2Title: "Leitura de sinal",
          lane2Body:
            "Headline, provas operacionais e rotas-chave aparecem antes do excesso.",
          lane3Title: "Aprofundamento",
          lane3Body:
            "O tráfego é empurrado para CVs, dashboard e ativos de confiança técnica.",
          surfaceLabel: "Sinais vivos do ecossistema",
          surfaceTitle:
            "Repositórios com função clara e sinais públicos em tempo de leitura.",
          surfaceBody:
            "Esta faixa deixa de ser apenas conceitual: o root passa a expor metadados públicos do GitHub e mostra como cada superfície participa do ecossistema.",
          relayFallbackIssues: "issues abertas",
          relayFallbackMeta: "metadados publicos",
          routeMainLabel: "Rota principal",
          routeBrLabel: "Mercado BR",
          routeBrTitle: "Currículo PT-BR",
          routeBrBody:
            "Versão orientada a recrutadores, gestão técnica e avaliação de fit local.",
          routeGlobalLabel: "Mercado global",
          routeGlobalBody:
            "Resumo enxuto para posições internacionais, remotas e de senioridade alta.",
          routeLinkedinLabel: "Rede profissional",
          routeLinkedinBody:
            "Contexto de carreira, networking e validação pública complementar.",
          closingLabel: "Próximo passo",
          closingTitle:
            "Menos ruído, mais intenção e uma saída final mais forte.",
          closingBody:
            "O domínio raiz precisa terminar com a mesma clareza com que começa: uma leitura curta, uma direção explícita e saídas que convertam sem parecer improvisadas.",
          closingCtaPrimary: "Continuar no Professional Hub",
          closingCtaSecondary: "Validar perfil publico",
          finalPathsLabel: "Caminhos finais de avaliacao",
          gameLabel: "Signal challenge",
          gameTitle: "Signal Challenge",
          gameSubtitle: "Entretenimento + utilidade em leitura rápida",
          gameRoundLabel: "Rodada",
          gameScoreLabel: "Placar",
          gameStreakLabel: "Sequência",
          gameBestLabel: "Melhor",
          gameQuestionStars: "Qual repositório está liderando em stars agora?",
          gameQuestionForks: "Qual repositório está liderando em forks agora?",
          gameQuestionIssues: "Qual repositório tem mais issues abertas agora?",
          gameHint:
            "Toque em um card para responder. O jogo usa sinais públicos em tempo de leitura.",
          gameHit: "Acerto. Sinal correto identificado.",
          gameMiss: "Quase. Compare os números e tente a próxima rodada.",
          gameTie: "Empate técnico nesta rodada.",
          gameWinnerLabel: "Vencedor atual",
          gameOpenWinner: "Abrir repositório vencedor",
          dailyLabel: "Daily challenge",
          dailyTitle: "Daily Signal",
          dailySubtitle: "Uma tentativa por dia com métrica rotativa",
          dailyLocked: "Desafio diário concluído. Volte amanhã.",
          dailyAvailable: "Você tem uma tentativa hoje.",
          dailyHit: "Daily concluído com acerto.",
          dailyMiss: "Daily concluído. Amanhã tem nova rodada.",
          dailyAction: "Jogar daily",
          gameLevelLabel: "Nível",
          gameNextLevelLabel: "Próximo nível",
          easterLabel: "Easter egg",
          easterTitle: "Cartão isolado",
          easterHint: "Se notar o gesto, clique. Nem todo mundo percebe.",
          easterFound: "Você achou o easter egg. Bom radar visual.",
          easterAction: "Abrir GitHub",
          neonLabel: "Modo secreto",
          neonHint: "Ative com: ↑ ↑ ↓ ↓ A",
          neonActive: "Neon mode ativado por 45 segundos.",
          neonStatusOn: "Neon ativo",
          neonStatusOff: "Aguardando código",
        }
      : {
          heroTitle: "Architecture, visual impact and professional signal.",
          heroLede:
            "Root presence of the DataCrash ecosystem. The goal is not to list everything, but to route quickly to what matters: professional narrative, technical depth and conversion to contact.",
          ctaPrimary: "Open Professional Hub",
          ctaSecondary: "Open GitHub profile",
          priorityLabel: "Priority routes",
          cvPt: "Download CV PT-BR",
          cvEn: "Download CV EN",
          topStatusLabel: "Root domain status",
          transmissionLabel: "Active transmission",
          heroAlert:
            "Primary entry for technical evaluation and professional narrative",
          heroFlowLabel: "Primary reading flow",
          flowEntry: "Entry",
          flowRead: "Read",
          flowExit: "Exit",
          flowEntryDesc: "Root gateway with quick scan",
          flowReadDesc: "Evidence, repositories and CVs in sequence",
          flowExitDesc: "Hub, public profile and contact without noise",
          proofLabel: "Operational proof",
          proof1Title: "Premium hub published",
          proof1Body:
            "Narrative, dashboard, CVs and privacy already exposed on the public domain.",
          proof2Title: "GitHub profile active",
          proof2Body:
            "The public identity already connects with the rest of the ecosystem without looking isolated.",
          proof3Title: "Actions deploy validated",
          proof3Body:
            "The root domain keeps its own publication flow, predictable and aligned with updates.",
          assemblyLabel: "Interface in progress",
          assemblyEyebrow: "Interface in progress",
          assemblyTitle:
            "Navigation that feels like a living system, not a static showcase.",
          assemblyBody:
            "The root domain behaves as a signal router: each block reacts to movement, reinforces context and prepares transition to the main hub without polluting reading flow.",
          lane1Title: "Entry",
          lane1Body:
            "GitHub, LinkedIn and references converge to one common starting point.",
          lane2Title: "Signal reading",
          lane2Body:
            "Headline, operational proof and key routes appear before excess.",
          lane3Title: "Deep dive",
          lane3Body:
            "Traffic is pushed to CVs, dashboard and technical trust assets.",
          surfaceLabel: "Live ecosystem signals",
          surfaceTitle:
            "Repositories with clear purpose and public signals in reading time.",
          surfaceBody:
            "This strip is no longer only conceptual: the root now exposes public GitHub metadata and shows how each surface participates in the ecosystem.",
          relayFallbackIssues: "open issues",
          relayFallbackMeta: "public metadata",
          routeMainLabel: "Main route",
          routeBrLabel: "BR market",
          routeBrTitle: "CV PT-BR",
          routeBrBody:
            "Version tailored for recruiters, technical management and local fit assessment.",
          routeGlobalLabel: "Global market",
          routeGlobalBody:
            "Concise summary for international, remote and senior-level positions.",
          routeLinkedinLabel: "Professional network",
          routeLinkedinBody:
            "Career context, networking and complementary public validation.",
          closingLabel: "Next step",
          closingTitle: "Less noise, more intention and a stronger final exit.",
          closingBody:
            "The root domain should end with the same clarity it starts with: short reading, explicit direction and exits that convert without looking improvised.",
          closingCtaPrimary: "Continue to Professional Hub",
          closingCtaSecondary: "Validate public profile",
          finalPathsLabel: "Final evaluation paths",
          gameLabel: "Signal challenge",
          gameTitle: "Signal Challenge",
          gameSubtitle: "Entertainment + utility in quick reading",
          gameRoundLabel: "Round",
          gameScoreLabel: "Score",
          gameStreakLabel: "Streak",
          gameBestLabel: "Best",
          gameQuestionStars: "Which repository is leading in stars right now?",
          gameQuestionForks: "Which repository is leading in forks right now?",
          gameQuestionIssues:
            "Which repository has the highest number of open issues right now?",
          gameHint:
            "Tap one card to answer. The game uses public signals in reading time.",
          gameHit: "Correct. Right signal identified.",
          gameMiss: "Close. Compare the numbers and try the next round.",
          gameTie: "Technical tie in this round.",
          gameWinnerLabel: "Current winner",
          gameOpenWinner: "Open winning repository",
          dailyLabel: "Daily challenge",
          dailyTitle: "Daily Signal",
          dailySubtitle: "One attempt per day with rotating metric",
          dailyLocked: "Daily challenge completed. Come back tomorrow.",
          dailyAvailable: "You have one attempt today.",
          dailyHit: "Daily completed with a hit.",
          dailyMiss: "Daily completed. New round tomorrow.",
          dailyAction: "Play daily",
          gameLevelLabel: "Level",
          gameNextLevelLabel: "Next level",
          easterLabel: "Easter egg",
          easterTitle: "Isolated card",
          easterHint:
            "If you spot the gesture, click it. Not everyone notices.",
          easterFound: "You found the easter egg. Good visual radar.",
          easterAction: "Open GitHub",
          neonLabel: "Secret mode",
          neonHint: "Activate with: ↑ ↑ ↓ ↓ A",
          neonActive: "Neon mode enabled for 45 seconds.",
          neonStatusOn: "Neon active",
          neonStatusOff: "Waiting for code",
        };

  const localizedSignalArtifacts =
    locale === "pt-BR"
      ? signalArtifacts
      : [
          "PT-BR CV tailored for local screening",
          "EN resume for international positions",
          "LinkedIn as complementary public validation",
          "Profile README and animation as a living layer",
        ];

  const localizedHiringRoutes =
    locale === "pt-BR"
      ? hiringRoutes
      : [
          {
            index: "01",
            label: "BR Market",
            title: "CV PT-BR",
            href: "https://datacrash.github.io/professional-hub/#/cv-ptbr",
            note: "Short reading flow for local recruiting and technical leadership.",
          },
          {
            index: "02",
            label: "Global Market",
            title: "Resume EN",
            href: "https://datacrash.github.io/professional-hub/#/cv-en",
            note: "Lean version for international and remote opportunities.",
          },
          {
            index: "03",
            label: "Public Validation",
            title: "LinkedIn",
            href: "https://www.linkedin.com/in/datacrash/",
            note: "Career context, networking and public consistency.",
          },
        ];

  const localizedDecisionVectors =
    locale === "pt-BR"
      ? decisionVectors
      : [
          {
            index: "01",
            title: "Executive read",
            description:
              "The hub delivers narrative, technical depth and leadership context in a short flow.",
          },
          {
            index: "02",
            title: "Objective screening",
            description:
              "CV PT-BR and Resume EN stay accessible without forcing extra navigation.",
          },
          {
            index: "03",
            title: "Public validation",
            description:
              "GitHub and LinkedIn close the journey with coherent identity and history.",
          },
        ];

  function getLocalizedRepoDescription(signal: RepositorySignalSeed) {
    if (locale === "pt-BR") {
      return signal.description;
    }

    if (signal.repository === "datacrash.github.io") {
      return "Entry layer with fast routing, visual presence and operational proof.";
    }

    if (signal.repository === "professional-hub") {
      return "Technical dashboard, professional storytelling, privacy and CV routes in short flow.";
    }

    return "Animated README, public signals and identity complementing the root domain.";
  }

  const gameMetricsOrder: Array<GameMetric> = ["stars", "forks", "openIssues"];
  const currentGameMetric =
    gameMetricsOrder[gameRound % gameMetricsOrder.length];
  const gameQuestionByMetric: Record<GameMetric, string> = {
    stars: copy.gameQuestionStars,
    forks: copy.gameQuestionForks,
    openIssues: copy.gameQuestionIssues,
  };

  const gameCandidates = repositorySignals.map((signal) => {
    const live = liveRepositorySignals[signal.repository];
    const fallback =
      fallbackRepoGameMetrics[signal.repository] ??
      fallbackRepoGameMetrics["datacrash.github.io"];

    return {
      ...signal,
      stars: live?.stars ?? fallback.stars,
      forks: live?.forks ?? fallback.forks,
      openIssues: live?.openIssues ?? fallback.openIssues,
      language: live?.language ?? "mixed",
    };
  });

  const topGameMetric = Math.max(
    ...gameCandidates.map((candidate) => candidate[currentGameMetric]),
  );
  const gameWinnerCandidates = gameCandidates.filter(
    (candidate) => candidate[currentGameMetric] === topGameMetric,
  );
  const gameWinners = new Set(
    gameWinnerCandidates.map((candidate) => candidate.repository),
  );
  const gameLevel = Math.floor(gameScore / 3) + 1;
  const gameNextLevelScore = gameLevel * 3;
  const gameLevelProgress = Math.min(
    100,
    Math.round((gameScore / gameNextLevelScore) * 100),
  );

  const dailyMetric =
    gameMetricsOrder[
      getDailyMetricIndex(todayDateKey, gameMetricsOrder.length)
    ];
  const dailyTopMetric = Math.max(
    ...gameCandidates.map((candidate) => candidate[dailyMetric]),
  );
  const dailyWinnerCandidates = gameCandidates.filter(
    (candidate) => candidate[dailyMetric] === dailyTopMetric,
  );
  const dailyWinners = new Set(
    dailyWinnerCandidates.map((candidate) => candidate.repository),
  );
  const dailyWinner = dailyWinnerCandidates[0] ?? null;
  const isDailyAnswered =
    dailyChallenge.dateKey === todayDateKey && dailyChallenge.answered;
  let dailyFeedback = copy.dailyAvailable;

  if (isDailyAnswered) {
    dailyFeedback = dailyChallenge.hit ? copy.dailyHit : copy.dailyMiss;
  }

  function handleGamePick(repository: string) {
    const hit = gameWinners.has(repository);

    if (hit) {
      setGameScore((value) => value + 1);
      setGameStreak((value) => {
        const nextValue = value + 1;
        setGameBestStreak((bestValue) => Math.max(bestValue, nextValue));
        return nextValue;
      });
      setGameFeedback(copy.gameHit);
    } else {
      setGameStreak(0);
      setGameFeedback(copy.gameMiss);
    }

    setGameLastWinningRepo(gameWinnerCandidates[0] ?? null);
    setGameLastRoundTie(gameWinnerCandidates.length > 1);

    setGameRound((value) => value + 1);
  }

  function handleDailyPick(repository: string) {
    if (isDailyAnswered) {
      return;
    }

    const hit = dailyWinners.has(repository);

    setDailyChallenge({
      dateKey: todayDateKey,
      answered: true,
      hit,
      pickedRepository: repository,
    });
  }

  function handleEasterEggClick() {
    if (easterEggFound) {
      return;
    }

    setEasterEggFound(true);
    setGameFeedback(copy.easterFound);
  }

  function handleKonamiLiteInput(keyCode: string) {
    const expectedKey = konamiLiteSequence[konamiIndex];

    if (keyCode === expectedKey) {
      const nextIndex = konamiIndex + 1;

      if (nextIndex >= konamiLiteSequence.length) {
        setKonamiIndex(0);
        setNeonMode(true);
        setNeonModeEndsAt(Date.now() + 45_000);
        setGameFeedback(copy.neonActive);
        return;
      }

      setKonamiIndex(nextIndex);
      return;
    }

    setKonamiIndex(keyCode === konamiLiteSequence[0] ? 1 : 0);
  }

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

  useEffect(() => {
    localStorage.setItem(
      gameStorageKey,
      JSON.stringify({
        round: gameRound,
        score: gameScore,
        streak: gameStreak,
        bestStreak: gameBestStreak,
      } satisfies StoredGameProgress),
    );
  }, [gameRound, gameScore, gameStreak, gameBestStreak]);

  useEffect(() => {
    localStorage.setItem(
      dailyChallengeStorageKey,
      JSON.stringify(dailyChallenge satisfies StoredDailyChallenge),
    );
  }, [dailyChallenge]);

  useEffect(() => {
    if (easterEggFound) {
      localStorage.setItem(easterEggStorageKey, "found");
    }
  }, [easterEggFound]);

  useEffect(() => {
    if (!neonModeEndsAt) {
      return;
    }

    const remainingMs = Math.max(0, neonModeEndsAt - Date.now());
    const timeout = globalThis.setTimeout(() => {
      setNeonMode(false);
      setNeonModeEndsAt(null);
    }, remainingMs);

    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [neonModeEndsAt]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editable = target?.closest(
        "input, textarea, [contenteditable='true']",
      );

      if (editable) {
        return;
      }

      handleKonamiLiteInput(event.code);
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [konamiIndex, copy.neonActive]);

  return (
    <main className={`shell${neonMode ? " neon-mode" : ""}`} ref={shellRef}>
      <div className="cursor-veil" aria-hidden="true" />
      <div className="forming-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="topbar" aria-label={copy.topStatusLabel}>
        <span>Root Entry</span>
        <span>GitHub Actions Live</span>
        <span>Professional Signal Online</span>
      </section>

      <section
        className="transmission-band"
        aria-label={copy.transmissionLabel}
      >
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

      <section
        className="control-strip"
        aria-label="Idioma e acessos prioritarios"
      >
        <fieldset className="language-toggle" aria-label="Language toggle">
          <button
            type="button"
            className={locale === "pt-BR" ? "is-active" : ""}
            onClick={() => {
              setLocale("pt-BR");
              localStorage.setItem(localeStorageKey, "pt-BR");
            }}
          >
            PT-BR
          </button>
          <button
            type="button"
            className={locale === "en" ? "is-active" : ""}
            onClick={() => {
              setLocale("en");
              localStorage.setItem(localeStorageKey, "en");
            }}
          >
            EN
          </button>
        </fieldset>

        <div className="priority-links" aria-label={copy.priorityLabel}>
          <a
            href="https://www.linkedin.com/in/datacrash/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href={cvPtBrDownloadUrl} target="_blank" rel="noreferrer">
            {copy.cvPt}
          </a>
          <a href={cvEnDownloadUrl} target="_blank" rel="noreferrer">
            {copy.cvEn}
          </a>
          <a
            href="https://github.com/DataCrash"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="hero-stack">
            <p className="eyebrow">datacrash.github.io</p>
            <div className="hero-alert">
              <span className="hero-ping" aria-hidden="true" />
              <span>{copy.heroAlert}</span>
            </div>
            <h1>{copy.heroTitle}</h1>
            <p className="lede">{copy.heroLede}</p>

            <div className="hero-flow" aria-label={copy.heroFlowLabel}>
              <article>
                <span className="metric-label">{copy.flowEntry}</span>
                <strong>{copy.flowEntryDesc}</strong>
              </article>
              <article>
                <span className="metric-label">{copy.flowRead}</span>
                <strong>{copy.flowReadDesc}</strong>
              </article>
              <article>
                <span className="metric-label">{copy.flowExit}</span>
                <strong>{copy.flowExitDesc}</strong>
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
                {copy.ctaPrimary}
              </a>
              <a
                className="secondary-link"
                href="https://github.com/DataCrash"
                target="_blank"
                rel="noreferrer"
              >
                {copy.ctaSecondary}
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

      <section className="proof-strip" aria-label={copy.proofLabel}>
        <div className="proof-card">
          <span className="proof-index">01</span>
          <strong>{copy.proof1Title}</strong>
          <p>{copy.proof1Body}</p>
        </div>
        <div className="proof-card">
          <span className="proof-index">02</span>
          <strong>{copy.proof2Title}</strong>
          <p>{copy.proof2Body}</p>
        </div>
        <div className="proof-card">
          <span className="proof-index">03</span>
          <strong>{copy.proof3Title}</strong>
          <p>{copy.proof3Body}</p>
        </div>
      </section>

      <section className="assembly-map" aria-label={copy.assemblyLabel}>
        <div className="assembly-copy">
          <p className="eyebrow">{copy.assemblyEyebrow}</p>
          <h2>{copy.assemblyTitle}</h2>
          <p>{copy.assemblyBody}</p>
        </div>

        <div className="assembly-lane">
          <article className="assembly-node">
            <span className="assembly-step">01</span>
            <h3>{copy.lane1Title}</h3>
            <p>{copy.lane1Body}</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node assembly-node-accent">
            <span className="assembly-step">02</span>
            <h3>{copy.lane2Title}</h3>
            <p>{copy.lane2Body}</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="assembly-node">
            <span className="assembly-step">03</span>
            <h3>{copy.lane3Title}</h3>
            <p>{copy.lane3Body}</p>
            <div className="ghost-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
        </div>
      </section>

      <section className="surface-grid" aria-label={copy.surfaceLabel}>
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
          <h2>{copy.surfaceTitle}</h2>
          <p>{copy.surfaceBody}</p>

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
                    <p>{getLocalizedRepoDescription(signal)}</p>

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
                          ? `${liveSignal.openIssues} ${copy.relayFallbackIssues}`
                          : copy.relayFallbackMeta}
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
            {localizedHiringRoutes.map((route) => (
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

          <div
            className="signal-preview"
            aria-label={
              locale === "pt-BR"
                ? "Preview do perfil GitHub"
                : "GitHub profile preview"
            }
          >
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

            <div
              className="artifact-list"
              aria-label={
                locale === "pt-BR"
                  ? "Ativos complementares"
                  : "Complementary assets"
              }
            >
              {localizedSignalArtifacts.map((artifact, index) => (
                <article key={artifact} className="artifact-item">
                  <span className="artifact-bullet">0{index + 1}</span>
                  <p>{artifact}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="signal-game" aria-label={copy.gameLabel}>
        <div className="signal-game-head">
          <div>
            <p className="eyebrow">{copy.gameTitle}</p>
            <h2>{copy.gameSubtitle}</h2>
          </div>
          <div className="signal-game-stats">
            <span>
              {copy.gameRoundLabel}: {gameRound + 1}
            </span>
            <span>
              {copy.gameScoreLabel}: {gameScore}
            </span>
            <span>
              {copy.gameStreakLabel}: {gameStreak}
            </span>
            <span>
              {copy.gameBestLabel}: {gameBestStreak}
            </span>
          </div>
        </div>

        <div className="neon-console" aria-label={copy.neonLabel}>
          <span className="neon-console-status">
            {neonMode ? copy.neonStatusOn : copy.neonStatusOff}
          </span>
          <span>{copy.neonHint}</span>
          <div className="neon-console-progress" aria-hidden="true">
            {konamiLiteSequence.map((step, index) => (
              <span
                key={`konami-${step}-${index}`}
                className={konamiIndex > index ? "is-lit" : ""}
              />
            ))}
          </div>
        </div>

        <div className="signal-game-level" aria-label={copy.gameLevelLabel}>
          <div className="signal-game-level-head">
            <span>
              {copy.gameLevelLabel}: {gameLevel}
            </span>
            <span>
              {copy.gameNextLevelLabel}: {gameNextLevelScore}
            </span>
          </div>
          <div className="signal-game-level-track" aria-hidden="true">
            <div
              className="signal-game-level-fill"
              style={{ width: `${gameLevelProgress}%` }}
            />
          </div>
        </div>

        <aside className="easter-egg-card" aria-label={copy.easterLabel}>
          <p className="easter-egg-kicker">{copy.easterTitle}</p>
          <button
            type="button"
            className={`easter-egg-trigger ${easterEggFound ? "is-found" : ""}`}
            onClick={handleEasterEggClick}
            aria-label="Unlock easter egg"
          >
            🖖
          </button>
          <p className="easter-egg-copy">
            {easterEggFound ? copy.easterFound : copy.easterHint}
          </p>
          {easterEggFound ? (
            <a
              className="signal-game-link"
              href="https://github.com/DataCrash"
              target="_blank"
              rel="noreferrer"
            >
              {copy.easterAction}
            </a>
          ) : null}
        </aside>

        <p className="signal-game-question">
          {gameQuestionByMetric[currentGameMetric]}
        </p>

        <div className="signal-game-grid">
          {gameCandidates.map((candidate) => (
            <button
              key={`game-${candidate.repository}`}
              type="button"
              className="signal-game-card"
              onClick={() => {
                handleGamePick(candidate.repository);
              }}
            >
              <strong>{candidate.title}</strong>
              <p>{getLocalizedRepoDescription(candidate)}</p>
              <div>
                <span>⭐ {candidate.stars}</span>
                <span>⑂ {candidate.forks}</span>
                <span>! {candidate.openIssues}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="signal-game-feedback" aria-live="polite">
          {gameFeedback || copy.gameHint}
        </p>

        {gameLastWinningRepo ? (
          <div className="signal-game-actions">
            <p className="signal-game-meta">
              {copy.gameWinnerLabel}: {gameLastWinningRepo.title}
              {gameLastRoundTie ? ` • ${copy.gameTie}` : ""}
            </p>
            <a
              className="signal-game-link"
              href={gameLastWinningRepo.href}
              target="_blank"
              rel="noreferrer"
            >
              {copy.gameOpenWinner}
            </a>
          </div>
        ) : null}

        <div className="daily-challenge" aria-label={copy.dailyLabel}>
          <div className="daily-challenge-head">
            <div>
              <p className="eyebrow">{copy.dailyTitle}</p>
              <p className="daily-challenge-subtitle">{copy.dailySubtitle}</p>
            </div>
            <span className="feed-badge">
              {isDailyAnswered ? copy.dailyLocked : copy.dailyAction}
            </span>
          </div>

          <p className="signal-game-question">
            {gameQuestionByMetric[dailyMetric]}
          </p>

          <div className="signal-game-grid">
            {gameCandidates.map((candidate) => (
              <button
                key={`daily-${candidate.repository}`}
                type="button"
                className="signal-game-card"
                disabled={isDailyAnswered}
                onClick={() => {
                  handleDailyPick(candidate.repository);
                }}
              >
                <strong>{candidate.title}</strong>
                <p>{getLocalizedRepoDescription(candidate)}</p>
                <div>
                  <span>⭐ {candidate.stars}</span>
                  <span>⑂ {candidate.forks}</span>
                  <span>! {candidate.openIssues}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="signal-game-feedback" aria-live="polite">
            {dailyFeedback}
          </p>

          {isDailyAnswered && dailyWinner ? (
            <div className="signal-game-actions">
              <p className="signal-game-meta">
                {copy.gameWinnerLabel}: {dailyWinner.title}
              </p>
              <a
                className="signal-game-link"
                href={dailyWinner.href}
                target="_blank"
                rel="noreferrer"
              >
                {copy.gameOpenWinner}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <section className="routes-stage" aria-label={copy.priorityLabel}>
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
            <span className="route-kicker">{copy.routeMainLabel}</span>
            <h2>Professional Hub</h2>
            <p>
              {locale === "pt-BR"
                ? "Dashboard, storytelling técnico, privacidade clara e experiência premium."
                : "Dashboard, technical storytelling, clear privacy and premium experience."}
            </p>
          </a>

          <a
            className="route-card"
            href="https://datacrash.github.io/professional-hub/#/cv-ptbr"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">{copy.routeBrLabel}</span>
            <h2>{copy.routeBrTitle}</h2>
            <p>{copy.routeBrBody}</p>
          </a>

          <a
            className="route-card"
            href="https://datacrash.github.io/professional-hub/#/cv-en"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">{copy.routeGlobalLabel}</span>
            <h2>Resume EN</h2>
            <p>{copy.routeGlobalBody}</p>
          </a>

          <a
            className="route-card"
            href="https://www.linkedin.com/in/datacrash/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="route-kicker">{copy.routeLinkedinLabel}</span>
            <h2>LinkedIn</h2>
            <p>{copy.routeLinkedinBody}</p>
          </a>
        </div>
      </section>

      <section className="closing-grid" aria-label="Fechamento da jornada">
        <div className="closing-panel closing-panel-primary">
          <p className="eyebrow">{copy.closingLabel}</p>
          <h2>{copy.closingTitle}</h2>
          <p>{copy.closingBody}</p>

          <div className="closing-actions">
            <a
              className="primary-link"
              href="https://datacrash.github.io/professional-hub/"
              target="_blank"
              rel="noreferrer"
            >
              {copy.closingCtaPrimary}
            </a>
            <a
              className="secondary-link"
              href="https://github.com/DataCrash"
              target="_blank"
              rel="noreferrer"
            >
              {copy.closingCtaSecondary}
            </a>
          </div>
        </div>

        <div className="closing-panel closing-panel-secondary">
          <div className="surface-panel-head">
            <p className="eyebrow">Decision vectors</p>
            <span className="feed-badge">Final routing</span>
          </div>

          <div className="decision-list" aria-label={copy.finalPathsLabel}>
            {localizedDecisionVectors.map((item) => (
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
