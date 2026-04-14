const BREVO_API_URL = 'https://api.brevo.com/v3'

export async function addBrevoContact({
  email,
  firstName,
  listIds,
}: {
  email: string
  firstName?: string
  listIds: number[]
}) {
  const res = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: firstName ?? '' },
      listIds,
      updateEnabled: true,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('[Brevo] addContact failed:', err)
  }
}

export async function sendBrevoTemplate({
  to,
  templateId,
  params,
}: {
  to: string
  templateId: number
  params?: Record<string, string>
}) {
  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: [{ email: to }],
      templateId,
      params: params ?? {},
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('[Brevo] sendTemplate failed:', err)
  }
}
