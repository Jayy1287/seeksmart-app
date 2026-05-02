import { apiOk } from "@/server/http/responses";

export function GET() {
  return apiOk({
    service: "seeksmart-api",
    version: "v1",
    status: "healthy"
  });
}
