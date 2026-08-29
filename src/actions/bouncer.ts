export async function bouncer(
  token: string,
  username: string,
  pagename: string,
) {
  return (
    await (
      await fetch("/api/bouncer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          pagename,
        }),
      })
    ).json()
  ).authenticated;
}
