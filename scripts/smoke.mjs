const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const paths = [
  "/",
  "/tools",
  "/use-cases",
  "/industries",
  "/opportunities",
  "/audit",
  "/audit/start",
  "/audit/questions",
  "/feedback",
  "/privacy",
  "/terms",
  "/api/v1/health"
];

const failures = [];

for (const path of paths) {
  const url = new URL(path, baseUrl);
  const response = await fetch(url, {
    redirect: "manual"
  });

  if (response.status < 200 || response.status >= 400) {
    failures.push(`${response.status} ${path}`);
  }

  console.log(`${response.status} ${path}`);
}

if (failures.length > 0) {
  console.error(`Smoke check failed:\n${failures.join("\n")}`);
  process.exit(1);
}
