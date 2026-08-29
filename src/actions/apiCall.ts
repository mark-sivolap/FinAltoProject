export async function apiCall(
  token: string,
  endpoint: string,
  body: { [key: string]: unknown },
) {
  const response = await fetch("/api/" + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok)
    throw new Error(
      "API Call Failed, returning " +
        response.status +
        " - " +
        response.statusText,
    );
  const data = await response.json();
  return data;
}
