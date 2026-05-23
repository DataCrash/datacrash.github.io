export type SkillLevel = "Especialista" | "Avançado" | "Intermediário";

export interface Skill {
  name: string;
  context: string;
  level: SkillLevel;
}

export interface ProfessionalStory {
  title: string;
  summary: string;
  highlights: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  outcome: string;
}

export interface VolunteeringExperience {
  role: string;
  organization: string;
  summary: string;
  qualitiesApplied: string[];
  workplaceBenefits: string[];
}

export interface ExternalRoute {
  label: string;
  description: string;
  href: string;
  isPrimary?: boolean;
}

export interface RepositoryDashboardConfig {
  owner: string;
  name: string;
  label: string;
  description: string;
  href: string;
}

export interface RepositoryMetricsSnapshot {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  lastUpdatedAt: string;
}

export interface ProfessionalProfile {
  fullName: string;
  headline: string;
  location: string;
  lifeAndCareerSummary: string;
  story: ProfessionalStory;
  hardSkills: Skill[];
  softSkills: Skill[];
  experiences: WorkExperience[];
  volunteering: VolunteeringExperience;
  routes: ExternalRoute[];
  repositoryDashboards: RepositoryDashboardConfig[];
}
