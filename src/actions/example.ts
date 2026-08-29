import { apiCall } from "./apiCall";

export async function examplePing(token: string) {
  return await apiCall(token, "example", {});
}
