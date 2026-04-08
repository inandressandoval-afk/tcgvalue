import { NextRequest, NextResponse } from 'next/server'
import { getCard } from '@/lib/api/pokemon-tcg'
import { getCardPrices } from '@/lib/api/poketrace'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const card = await getCard(id)

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    // On passe les données de la carte directement — les prix tcgplayer/cardmarket
    // sont déjà inclus dans la réponse PokéTCG, pas besoin d'un 2ème appel API
    const prices = await getCardPrices(id, card.name, card.rarity ?? null, card as any)

    return NextResponse.json({ card, prices })
  } catch (err) {
    console.error('[CARD]', err)
    return NextResponse.json({ error: 'Failed to load card' }, { status: 500 })
  }
}
