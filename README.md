# TCGValue

Plateforme d'estimation de cartes Pokémon TCG d'occasion.
Mode pédagogique (formation) + Mode Pro (boutiques).

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.local.example .env.local
# → Éditez .env.local avec vos clés API (optionnel pour démarrer)

# 3. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

## Sans clés API

L'app fonctionne immédiatement **sans aucune clé** :
- **Catalogue cartes** : PokéTCG API fonctionne sans clé (100 req/10min)
- **Prix** : données simulées réalistes (badge "PRIX SIMULÉS" affiché)

## Obtenir les clés API

| Service | URL | Plan gratuit |
|---|---|---|
| PokéTCG API | https://pokemontcg.io | 20 000 req/jour |
| PokeTrace | https://poketrace.com/developers | 250 req/jour |
| PokemonPriceTracker | https://pokemonpricetracker.com/api | 100 crédits/jour |

## Structure

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx            # Accueil
│   ├── search/page.tsx     # Résultats de recherche
│   ├── card/[id]/page.tsx  # Détail d'une carte
│   └── api/                # Routes API
│       ├── search/         # GET /api/search
│       ├── cards/[id]/     # GET /api/cards/:id
│       └── events/         # POST /api/events (crowdsourcing)
├── components/
│   ├── card/               # CardThumb, PriceDisplay, RarityBadge, CardTracker
│   ├── search/             # SearchBar
│   └── layout/             # Header
├── lib/
│   ├── api/                # Clients API (pokemon-tcg, poketrace)
│   └── crowdsourcing/      # Moteur des 4 règles métier
└── types/                  # Types TypeScript centraux
```

## Règles métier crowdsourcing

```
Règle #1 — Collecte passive    : toute interaction est un signal silencieux
Règle #2 — Apprentissage       : les quiz génèrent des données de marché
Règle #3 — Service = collecteur: l'inventaire produit des données d'offre
Règle #4 — Pro valide          : les boutiques pondèrent les estimations
```

## Roadmap

- [x] Phase 1 : Recherche carte + affichage prix
- [ ] Phase 2 : Scan photo (Google Vision API)
- [ ] Phase 3 : Mode formation (quiz, simulateur)
- [ ] Phase 4 : Mode Pro (lot, exports, alertes)
- [ ] Phase 5 : Autres TCG (Magic, One Piece, Lorcana)
```
