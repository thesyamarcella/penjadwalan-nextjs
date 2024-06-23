import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const middleware = async (req: NextRequest) => {
  const session = await getToken({ req });

  if (!session && req.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};
