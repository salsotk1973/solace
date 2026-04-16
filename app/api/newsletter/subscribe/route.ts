import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { addBrevoContact } from '@/lib/brevo'

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress
  const firstName = user?.firstName ?? undefined

  if (!email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 })
  }

  try {
    await addBrevoContact({
      email,
      firstName,
      listIds: [5], // Solace Newsletter list
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Newsletter] Subscribe failed:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
