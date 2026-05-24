import { useEffect, useMemo, useState } from "react";

import type { RepositoryDashboardConfig } from "../../domain/models";
import { GitHubRepositoryMetricsProvider } from "../../infrastructure/GitHubRepositoryMetricsProvider";

type DashboardStatus = "idle" | "loading" | "ready" | "error";
type DashboardSource = "snapshot" | "live" | "unknown";

export type RepositoryDashboardView = {
  repository: RepositoryDashboardConfig;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  pulseScore: number;
  lastUpdatedLabel: string;
  status: DashboardStatus;
  source: DashboardSource;
};

function formatDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "sem atualização recente";
  }

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function calculatePulseScore(
  stars: number,
  forks: number,
  watchers: number,
): number {
  const rawScore = stars * 2 + forks * 3 + watchers;
  return Math.max(20, Math.min(100, rawScore));
}

export function useRepositoryDashboards(
  repositories: RepositoryDashboardConfig[],
) {
  const [items, setItems] = useState<RepositoryDashboardView[]>(() =>
    repositories.map((repository) => ({
      repository,
      stars: 0,
      forks: 0,
      openIssues: 0,
      watchers: 0,
      pulseScore: 0,
      lastUpdatedLabel: "carregando...",
      status: "idle",
      source: "unknown",
    })),
  );

  useEffect(() => {
    let isMounted = true;
    const provider = new GitHubRepositoryMetricsProvider();

    Promise.all(
      repositories.map(async (repository) => {
        try {
          const metrics = await provider.getRepositoryMetrics(repository);

          return {
            repository,
            stars: metrics.stars,
            forks: metrics.forks,
            openIssues: metrics.openIssues,
            watchers: metrics.watchers,
            pulseScore: calculatePulseScore(
              metrics.stars,
              metrics.forks,
              metrics.watchers,
            ),
            lastUpdatedLabel: formatDate(metrics.lastUpdatedAt),
            status: "ready" as const,
            source: metrics.source,
          };
        } catch {
          return {
            repository,
            stars: 0,
            forks: 0,
            openIssues: 0,
            watchers: 0,
            pulseScore: 0,
            lastUpdatedLabel: "indisponível",
            status: "error" as const,
            source: "unknown" as const,
          };
        }
      }),
    ).then((result) => {
      if (!isMounted) {
        return;
      }

      setItems(result);
    });

    return () => {
      isMounted = false;
    };
  }, [repositories]);

  async function refreshRepositoryLive(target: RepositoryDashboardConfig) {
    const provider = new GitHubRepositoryMetricsProvider();
    const targetKey = `${target.owner}/${target.name}`.toLowerCase();

    setItems((previousItems) =>
      previousItems.map((item) => {
        const itemKey =
          `${item.repository.owner}/${item.repository.name}`.toLowerCase();

        if (itemKey !== targetKey) {
          return item;
        }

        return {
          ...item,
          status: "loading",
        };
      }),
    );

    try {
      const metrics = await provider.getRepositoryMetrics(target, {
        forceLive: true,
      });

      setItems((previousItems) =>
        previousItems.map((item) => {
          const itemKey =
            `${item.repository.owner}/${item.repository.name}`.toLowerCase();

          if (itemKey !== targetKey) {
            return item;
          }

          return {
            ...item,
            stars: metrics.stars,
            forks: metrics.forks,
            openIssues: metrics.openIssues,
            watchers: metrics.watchers,
            pulseScore: calculatePulseScore(
              metrics.stars,
              metrics.forks,
              metrics.watchers,
            ),
            lastUpdatedLabel: formatDate(metrics.lastUpdatedAt),
            status: "ready",
            source: metrics.source,
          };
        }),
      );
    } catch {
      setItems((previousItems) =>
        previousItems.map((item) => {
          const itemKey =
            `${item.repository.owner}/${item.repository.name}`.toLowerCase();

          if (itemKey !== targetKey) {
            return item;
          }

          return {
            ...item,
            status: "error",
          };
        }),
      );
    }
  }

  const hasLoading = useMemo(
    () =>
      items.some((item) => item.status === "loading" || item.status === "idle"),
    [items],
  );

  return {
    items,
    hasLoading,
    refreshRepositoryLive,
  };
}
