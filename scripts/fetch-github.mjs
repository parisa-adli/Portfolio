// Fetches the GitHub profile + all public repos (README, languages, homepage, commit count)
// into content/raw/github.json. Needs an authenticated `gh` CLI. Run: node scripts/fetch-github.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const USER = "parisa-adli";
const gh = (path, extra = []) =>
  execFileSync("gh", ["api", ...extra, path], { encoding: "utf8", maxBuffer: 64 << 20 });
const json = (path) => JSON.parse(gh(path));

// Commit count on the default branch = last page number when per_page=1.
function commitCount(repo) {
  try {
    const head = gh(`repos/${USER}/${repo}/commits?per_page=1`, ["-i"]);
    const last = head.match(/[?&]page=(\d+)>; rel="last"/);
    return last ? Number(last[1]) : JSON.parse(head.slice(head.indexOf("["))).length;
  } catch {
    return null; // empty repo
  }
}

function readme(repo) {
  try {
    return gh(`repos/${USER}/${repo}/readme`, ["-H", "Accept: application/vnd.github.raw"]);
  } catch {
    return null;
  }
}

const profile = json(`users/${USER}`);
const repos = JSON.parse(gh(`users/${USER}/repos?per_page=100&type=owner`, ["--paginate", "--slurp"])).flat();

const out = {
  fetchedAt: new Date().toISOString(),
  profile,
  repos: repos.map((r) => ({
    name: r.name,
    description: r.description,
    homepage: r.homepage || null,
    html_url: r.html_url,
    fork: r.fork,
    archived: r.archived,
    topics: r.topics,
    stars: r.stargazers_count,
    created_at: r.created_at,
    pushed_at: r.pushed_at,
    default_branch: r.default_branch,
    languages: json(`repos/${USER}/${r.name}/languages`),
    commits: commitCount(r.name),
    readme: readme(r.name),
  })),
};

mkdirSync("content/raw", { recursive: true });
writeFileSync("content/raw/github.json", JSON.stringify(out, null, 2));
console.log(`${out.repos.length} repos saved to content/raw/github.json`);
