import type { RepositoryMetricsProvider } from "../domain/contracts";
import type {
  RepositoryDashboardConfig,
  RepositoryMetricsSnapshot,
} from "../domain/models";

type GitHubRepositoryResponse = {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  pushed_at: string;
};

export class GitHubRepositoryMetricsProvider implements RepositoryMetricsProvider {
  async getRepositoryMetrics(
    repository: RepositoryDashboardConfig,
  ): Promise<RepositoryMetricsSnapshot> {
    const endpoint = `https://api.github.com/repos/${repository.owner}/${repository.name}`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Falha ao carregar métricas de ${repository.name}`);
    }

    const payload = (await response.json()) as GitHubRepositoryResponse;

    return {
      stars: payload.stargazers_count,
      forks: payload.forks_count,
      openIssues: payload.open_issues_count,
      watchers: payload.subscribers_count,
      lastUpdatedAt: payload.pushed_at,
    };
  }
}
