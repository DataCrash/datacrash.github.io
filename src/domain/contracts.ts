import type {
  ProfessionalProfile,
  RepositoryDashboardConfig,
  RepositoryMetricsSnapshot,
} from "./models";

export interface ProfileDataSource {
  getProfessionalProfile(): ProfessionalProfile;
}

export interface RepositoryMetricsProvider {
  getRepositoryMetrics(
    repository: RepositoryDashboardConfig,
  ): Promise<RepositoryMetricsSnapshot>;
}
