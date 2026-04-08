import { NextRequest, NextResponse } from 'next/server'
import type { CrowdsourcingEvent } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const event = await req.json() as CrowdsourcingEvent

    // Validation minimale
    if (!event.type || !event.sessionId) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    // Phase 1 : log console structuré
    // Phase 2 : écriture en base (PostgreSQL / Redis)
    console.log('[CROWDSOURCING]', JSON.stringify({
      ...event,
      _ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown',
      _ua: req.headers.get('user-agent')?.slice(0, 50),
    }))

    // TODO Phase 2 : await db.events.insert(event)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
