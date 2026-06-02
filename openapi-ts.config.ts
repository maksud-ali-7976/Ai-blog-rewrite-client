import { defineConfig } from "@hey-api/openapi-ts";
let url = "https://test-api.1point2percent.com/swagger-admin/json";

url = "http://localhost:8080/swagger-admin-app/json";

export default defineConfig({
  input: url,
  output: "src/open-api-client/admin",
  debug: true,
  serviceResponse: "body",
  format: true,
  lint: true,
  experimental: true,
  client: "axios",
});