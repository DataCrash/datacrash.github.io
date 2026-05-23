import type { ExternalRoute, Skill, WorkExperience } from "../domain/models";

export interface LandingViewModel {
  hero: {
    title: string;
    subtitle: string;
    location: string;
    summary: string;
  };
  story: {
    title: string;
    summary: string;
    highlights: string[];
  };
  experiences: WorkExperience[];
  hardSkills: Skill[];
  softSkills: Skill[];
  volunteering: {
    role: string;
    organization: string;
    summary: string;
    qualitiesApplied: string[];
    workplaceBenefits: string[];
  };
  routes: ExternalRoute[];
}
