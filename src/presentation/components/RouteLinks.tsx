import type { ExternalRoute } from "../../domain/models";

type RouteLinksProps = {
  routes: ExternalRoute[];
};

export function RouteLinks({ routes }: Readonly<RouteLinksProps>) {
  return (
    <div className="route-grid">
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className={`route-card ${route.isPrimary ? "is-primary" : ""}`.trim()}
          target="_blank"
          rel="noreferrer"
        >
          <span>{route.label}</span>
          <p>{route.description}</p>
        </a>
      ))}
    </div>
  );
}
