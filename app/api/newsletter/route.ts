export async function POST(req: Request) {
  const { email } = await req.json()
  console.log('[Newsletter] New subscriber:', email)
  // TODO: Add to Brevo list via API
  return Response.json({ success: true })
}
