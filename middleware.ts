import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/tools(.*)",
  "/tools",
  "/lab(.*)",
  "/lab",
  "/pricing",
  "/about",
  "/principles",
  "/privacy",
  "/terms",
  "/breathing(.*)",
  "/focus(.*)",
  "/sleep(.*)",
  "/mood(.*)",
  "/gratitude(.*)",
  "/api/webhooks(.*)",
  "/api/stripe/(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

const darkFailureHtml = `<!doctype html><html lang="en" style="background:#090d14;color-scheme:dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#090d14"><title>Solace</title><style>html,body{margin:0;min-height:100%;background:#090d14;color:#e4def6}body{min-height:100vh;display:block}</style></head><body></body></html>`;

function isApiRequest(request: NextRequest) {
  return request.nextUrl.pathname.startsWith("/api");
}

function buildFailureResponse(request: NextRequest) {
  if (isApiRequest(request)) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return new NextResponse(darkFailureHtml, {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default clerkMiddleware(async (auth, request) => {
  try {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  } catch (error) {
    // If it's an API request, return 401
    if (isApiRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For page requests, redirect to sign-in
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
