import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const clerkConfigured =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY)

const middleware = clerkConfigured
  ? clerkMiddleware(() => {})
  : () => NextResponse.next()

export default middleware

export const config = {
  matcher: [
    '/((?!_next|sign-in(?:/.*)?|sign-up(?:/.*)?|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
