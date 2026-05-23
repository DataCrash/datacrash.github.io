import type { RepositoryDashboardConfig } from "../../domain/models";
import {
  useRepositoryDashboards,
  type RepositoryDashboardView,
} from "../hooks/useRepositoryDashboards";

type RepositoryDashboardsProps = {
  repositories: RepositoryDashboardConfig[];
};

function DashboardCard({ item }: Readonly<{ item: RepositoryDashboardView }>) {
  return (
    <article className={`dashboard-card status-${item.status}`}>
      <header className="dashboard-header">
        <h3>{item.repository.label}</h3>
        <span className="dashboard-badge">Pulse {item.pulseScore}</span>
      </header>
      <p className="dashboard-description">{item.repository.description}</p>

      <div className="dashboard-metrics">
        <div>
          <strong>{item.stars}</strong>
          <span>Stars</span>
        </div>
        <div>
          <strong>{item.forks}</strong>
          <span>Forks</span>
        </div>
        <div>
          <strong>{item.watchers}</strong>
          <span>Watchers</span>
        </div>
        <div>
          <strong>{item.openIssues}</strong>
          <span>Issues</span>
        </div>
      </div>

      <div className="dashboard-footer">
        <small>Atualizado: {item.lastUpdatedLabel}</small>
        <a href={item.repository.href} target="_blank" rel="noreferrer">
          Abrir repositório
        </a>
      </div>
    </article>
  );
}

export function RepositoryDashboards({
  repositories,
}: Readonly<RepositoryDashboardsProps>) {
  const { items, hasLoading } = useRepositoryDashboards(repositories);

  return (
    <div className="dashboard-grid" aria-live="polite">
      {items.map((item) => (
        <DashboardCard
          key={`${item.repository.owner}/${item.repository.name}`}
          item={item}
        />
      ))}
      {hasLoading ? (
        <p className="dashboard-loading">
          Sincronizando sinais em tempo real...
        </p>
      ) : null}
    </div>
  );
}
