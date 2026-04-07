import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

const clerkConfigured =
  process.env.NODE_ENV !== 'development' &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY)

const darkFailureHtml = `<!doctype html><html lang="en" style="background:#090d14;color-scheme:dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#090d14"><title>Solace</title><style>html,body{margin:0;min-height:100%;background:#090d14;color:#e4def6}body{min-height:100vh;display:block}</style></head><body></body></html>`

function isApiRequest(request: NextRequest) {
  return request.nextUrl.pathname.startsWith('/api')
}

function buildFailureResponse(request: NextRequest) {
  if (isApiRequest(request)) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return new NextResponse(darkFailureHtml, {
    status: 500,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

const middleware = clerkConfigured
  ? (() => {
      const runClerk = clerkMiddleware(() => {})
      return async (request: NextRequest, event: NextFetchEvent) => {
        try {
          const response = await runClerk(request, event)

          if (!response) return NextResponse.next()

          const location = response.headers.get('location')
          if (location && response.status >= 300 && response.status < 400) {
            const target = new URL(location, request.url)
            const source = request.nextUrl
            const samePath = target.pathname === source.pathname && target.search === source.search
            if (samePath) {
              return buildFailureResponse(request)
            }
          }

          return response
        } catch {
          return buildFailureResponse(request)
        }
      }
    })()
  : () => NextResponse.next()

export default middleware

export const config = {
  matcher: [
    '/((?!_next|sign-in(?:/.*)?|sign-up(?:/.*)?|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
