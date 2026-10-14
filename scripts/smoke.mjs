const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const paths = [
  "/",
  "/tools",
  "/use-cases",
  "/industries",
  "/opportunities",
  "/audit",
  "/tools/chatgpt",
  "/use-cases/customer-support",
  "/methodology",
  "/sitemap.xml",
  "/robots.txt",
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

// Running the audit needs an account: anonymous visitors must be sent to login.
const gatedPaths = ["/audit/questions", "/audit/questions?industry=ecommerce"];

for (const path of gatedPaths) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  const location = response.headers.get("location") ?? "";

  if (response.status < 300 || response.status >= 400 || !location.includes("/login?callbackUrl=")) {
    failures.push(`${response.status} ${path} (expected redirect to /login, got "${location}")`);
  }

  console.log(`${response.status} ${path} -> ${location}`);
}

if (failures.length > 0) {
  console.error(`Smoke check failed:\n${failures.join("\n")}`);
  process.exit(1);
}
