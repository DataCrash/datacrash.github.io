import type { ProfileDataSource } from "../domain/contracts";
import type { LandingViewModel } from "../presentation/types";

export interface LandingPageUseCase {
  build(): LandingViewModel;
}

export class LandingPageBuilder implements LandingPageUseCase {
  private readonly dataSource: ProfileDataSource;

  constructor(dataSource: ProfileDataSource) {
    this.dataSource = dataSource;
  }

  build(): LandingViewModel {
    const profile = this.dataSource.getProfessionalProfile();

    return {
      hero: {
        title: profile.fullName,
        subtitle: profile.headline,
        location: profile.location,
        summary: profile.lifeAndCareerSummary,
      },
      story: {
        title: profile.story.title,
        summary: profile.story.summary,
        highlights: profile.story.highlights,
      },
      experiences: profile.experiences,
      hardSkills: profile.hardSkills,
      softSkills: profile.softSkills,
      volunteering: {
        role: profile.volunteering.role,
        organization: profile.volunteering.organization,
        summary: profile.volunteering.summary,
        qualitiesApplied: profile.volunteering.qualitiesApplied,
        workplaceBenefits: profile.volunteering.workplaceBenefits,
      },
      routes: profile.routes,
    };
  }
}
