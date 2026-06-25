// Cliente compartido para la Chatwoot REST API v1
// Usado por los webhooks de WhatsApp y Shopify

const base = () => {
  const url = process.env.CHATWOOT_API_URL || ''
  const id = process.env.CHATWOOT_ACCOUNT_ID || '1'
  return `${url}/api/v1/accounts/${id}`
}

const headers = () => ({
  'api_access_token': process.env.CHATWOOT_API_ACCESS_TOKEN || '',
  'Content-Type': 'application/json',
})

const enabled = () =>
  !!(process.env.CHATWOOT_API_URL && process.env.CHATWOOT_API_ACCESS_TOKEN)

interface CWContact {
  id: number
  name: string
  phone_number: string
}

interface CWConversation {
  id: number
  status: string
  inbox_id: number
}

export async function findOrCreateContact(phone: string): Promise<CWContact | null> {
  if (!enabled()) return null
  const q = phone.startsWith('+') ? phone : `+${phone}`

  const res = await fetch(`${base()}/contacts/search?q=${encodeURIComponent(q)}&page=1`, {
    headers: headers(),
  })
  if (res.ok) {
    const data = await res.json()
    if (data.payload?.length) return data.payload[0] as CWContact
  }

  const create = await fetch(`${base()}/contacts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ phone_number: q, name: phone }),
  })
  if (create.ok) return (await create.json()) as CWContact
  return null
}

export async function searchContactByPhone(phone: string): Promise<CWContact | null> {
  if (!enabled()) return null
  const q = phone.startsWith('+') ? phone : `+${phone}`

  const res = await fetch(`${base()}/contacts/search?q=${encodeURIComponent(q)}&page=1`, {
    headers: headers(),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.payload?.[0] ?? null
}

export async function findOrCreateConversation(
  contactId: number,
  inboxId: number
): Promise<CWConversation | null> {
  if (!enabled()) return null

  const res = await fetch(`${base()}/contacts/${contactId}/conversations`, {
    headers: headers(),
  })
  if (res.ok) {
    const data = await res.json()
    const open = (data.payload as CWConversation[] | undefined)?.find(
      c => c.status === 'open' && c.inbox_id === inboxId
    )
    if (open) return open
  }

  const create = await fetch(`${base()}/conversations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ inbox_id: inboxId, contact_id: contactId }),
  })
  if (create.ok) return (await create.json()) as CWConversation
  return null
}

// message_type: 0 = incoming (cliente), 1 = outgoing (agente/bot)
export async function addMessage(
  conversationId: number,
  content: string,
  type: 'incoming' | 'outgoing'
): Promise<void> {
  if (!enabled()) return
  await fetch(`${base()}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      content,
      message_type: type === 'incoming' ? 0 : 1,
      private: false,
    }),
  })
}

export async function updateContactAttributes(
  contactId: number,
  attributes: Record<string, string | number>
): Promise<void> {
  if (!enabled()) return
  await fetch(`${base()}/contacts/${contactId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ custom_attributes: attributes }),
  })
}
