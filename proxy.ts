import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/guide"];
const authRoutes = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuth = authRoutes.includes(path);

  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/signup", req.nextUrl));
  }

  if (isAuth && session?.userId) {
    return NextResponse.redirect(new URL("/guide", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)"],
};
