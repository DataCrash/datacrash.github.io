import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositories = [
  { owner: "DataCrash", name: "datacrash.github.io" },
  { owner: "DataCrash", name: "professional-hub" },
  { owner: "DataCrash", name: "datacrash" },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "public", "data");
const outputPath = path.join(outputDirectory, "repository-metrics.json");

const token =
  process.env.GITHUB_TOKEN || process.env.GH_PUBLIC_DATA_TOKEN || "";

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  if (token.trim()) {
    return {
      ...headers,
      Authorization: `Bearer ${token.trim()}`,
    };
  }

  return headers;
}

async function fetchRepository(repository) {
  const endpoint = `https://api.github.com/repos/${repository.owner}/${repository.name}`;
  const response = await fetch(endpoint, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Falha ao consultar ${repository.owner}/${repository.name}: ${response.status} ${body}`,
    );
  }

  const payload = await response.json();

  return {
    owner: repository.owner,
    name: repository.name,
    stars: payload.stargazers_count ?? 0,
    forks: payload.forks_count ?? 0,
    openIssues: payload.open_issues_count ?? 0,
    watchers: payload.subscribers_count ?? 0,
    lastUpdatedAt: payload.pushed_at ?? new Date().toISOString(),
  };
}

async function main() {
  const metrics = await Promise.all(repositories.map(fetchRepository));

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      note: "Dados gerados por script CI para evitar limite de rate no cliente",
      tokenConfigured: token.trim().length > 0,
    },
    repositories: metrics,
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Arquivo atualizado: ${outputPath}`);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
