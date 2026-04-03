import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { VISIT_DAY_COOKIE_NAME } from "@/lib/visit-cookie";
import { prisma } from "@/lib/prisma";

/** UTC 달력일 기준 하루 1회(쿠키) 방문 기록 */
export async function POST() {
  try {
    const todayUtc = new Date().toISOString().slice(0, 10);
    const store = await cookies();
    if (store.get(VISIT_DAY_COOKIE_NAME)?.value === todayUtc) {
      return new NextResponse(null, { status: 204 });
    }

    await prisma.siteVisit.create({ data: {} });

    const res = new NextResponse(null, { status: 204 });
    res.cookies.set(VISIT_DAY_COOKIE_NAME, todayUtc, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 48,
    });
    return res;
  } catch (e) {
    console.error("[visit POST]", e);
    return new NextResponse(null, { status: 500 });
  }
}
