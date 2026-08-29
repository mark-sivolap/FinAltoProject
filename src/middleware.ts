import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authenticate } from "./app/api/_HelperFunctions/authenticate";

interface TokenPayload {
  sub: string;
  name: string;
  email: string;
}

async function validateToken(token: string): Promise<TokenPayload> {
  if (process.env.NODE_ENV === "development" && token === "dev-token") {
    return {
      sub: "dev",
      name: "Local Developer",
      email: "dev@localhost",
    };
  }

  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Token validation failed");
  }

  const userInfo = await response.json();
  const email = userInfo.userPrincipalName.toLowerCase();
  if (!(await authenticate(email, ""))) throw new Error("Unauthorized");

  return {
    sub: userInfo.id,
    name: userInfo.displayName,
    email: userInfo.userPrincipalName,
  };
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(
      JSON.stringify({ error: "Missing or invalid authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const userInfo = await validateToken(token);
    const response = NextResponse.next();
    response.headers.set("user_ref", userInfo.email?.toLocaleLowerCase() ?? "");
    return response;
  } catch {
    return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  matcher: "/api/:path*",
};
