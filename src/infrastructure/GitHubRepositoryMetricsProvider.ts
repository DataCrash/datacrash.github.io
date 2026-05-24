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

type RepositoryMetricsSnapshotFile = {
  generatedAt: string;
  repositories: Array<
    RepositoryMetricsSnapshot & {
      owner: string;
      name: string;
    }
  >;
};

export class GitHubRepositoryMetricsProvider implements RepositoryMetricsProvider {
  private static snapshotPromise: Promise<
    Map<string, RepositoryMetricsSnapshot>
  > | null = null;

  private static readonly snapshotPath = `${import.meta.env.BASE_URL}data/repository-metrics.json`;

  private static toKey(owner: string, name: string): string {
    return `${owner}/${name}`.toLowerCase();
  }

  private async getSnapshotMap(): Promise<
    Map<string, RepositoryMetricsSnapshot>
  > {
    if (!GitHubRepositoryMetricsProvider.snapshotPromise) {
      GitHubRepositoryMetricsProvider.snapshotPromise = fetch(
        GitHubRepositoryMetricsProvider.snapshotPath,
        {
          cache: "no-store",
        },
      )
        .then(async (response) => {
          if (!response.ok) {
            return new Map<string, RepositoryMetricsSnapshot>();
          }

          const payload =
            (await response.json()) as RepositoryMetricsSnapshotFile;

          return payload.repositories.reduce((accumulator, repository) => {
            accumulator.set(
              GitHubRepositoryMetricsProvider.toKey(
                repository.owner,
                repository.name,
              ),
              {
                stars: repository.stars,
                forks: repository.forks,
                openIssues: repository.openIssues,
                watchers: repository.watchers,
                lastUpdatedAt: repository.lastUpdatedAt,
                source: "snapshot",
              },
            );

            return accumulator;
          }, new Map<string, RepositoryMetricsSnapshot>());
        })
        .catch(() => new Map<string, RepositoryMetricsSnapshot>());
    }

    return GitHubRepositoryMetricsProvider.snapshotPromise;
  }

  private async getFromApi(
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
      source: "live",
    };
  }

  async getRepositoryMetrics(
    repository: RepositoryDashboardConfig,
    options?: {
      forceLive?: boolean;
    },
  ): Promise<RepositoryMetricsSnapshot> {
    if (options?.forceLive) {
      return this.getFromApi(repository);
    }

    const key = GitHubRepositoryMetricsProvider.toKey(
      repository.owner,
      repository.name,
    );
    const snapshotMap = await this.getSnapshotMap();
    const snapshot = snapshotMap.get(key);

    if (snapshot) {
      return snapshot;
    }

    return this.getFromApi(repository);
  }
}
