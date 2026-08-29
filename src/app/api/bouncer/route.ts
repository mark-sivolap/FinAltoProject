import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../_HelperFunctions/authenticate";

export async function POST(req: NextRequest) {
  const { username, pagename } = await req.json();
  const authenticated = await authenticate(username, pagename);
  return NextResponse.json({ authenticated });
}
