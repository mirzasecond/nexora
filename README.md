# NEXORA - 3D Browser RPG

Full-stack 3D browser RPG game built with React, Three.js, TypeScript, Fastify, and PostgreSQL.

## Features (Phase 1)

- ✅ Full authentication (register/login)
- ✅ Player progression (XP, level, coins)
- ✅ Third-person 3D world
- ✅ Player movement (walk, run, sprint, jump)
- ✅ Smooth camera controls
- ✅ HUD display (HP, stamina, XP bar)
- ✅ Keyboard controls
- 🔄 Phases 2-6 in progress

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Three.js for 3D graphics
- React Three Fiber
- Zustand for state management
- Tailwind CSS for UI
- Axios for API calls

**Backend:**
- Node.js + Fastify
- TypeScript
- PostgreSQL
- JWT authentication
- Bcrypt for password hashing

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or use Docker)
- npm or pnpm

### Quick Start

1. Clone and install:
```bash
cd nexora
npm install --prefix client
npm install --prefix server
```

2. Start PostgreSQL (Docker):
```bash
docker-compose up -d
```

3. Set environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations (auto on server start)

5. Start development:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
nexora/
├── client/              # React + Three.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page routes
│   │   ├── game/        # Game engine components
│   │   ├── hooks/       # Custom hooks
│   │   ├── store.ts     # Zustand stores
│   │   └── api.ts       # API client
│   └── vite.config.ts
├── server/              # Fastify backend
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   └── db.ts        # Database connection
│   └── tsconfig.json
├── docker-compose.yml   # PostgreSQL setup
└── .env.example
```

## Controls

**Desktop:**
- WASD - Move
- SHIFT - Sprint
- SPACE - Jump
- E - Interact
- I - Inventory
- M - Map
- ESC - Menu

**Mobile:**
- Virtual joystick for movement
- Touch buttons for actions

## Build

```bash
# Frontend
cd client && npm run build

# Backend
cd server && npm run build
```

## Testing

- Register new account
- Login
- Move around 3D world
- Check HUD bars
- Open main menu

## Architecture Notes

- Server validates all critical data (XP, coins, equipment)
- Client state is local until explicitly saved
- Position updates are throttled (not every frame)
- No fake placeholders - all features are functional
- Performance optimized with LOD, culling, pooling

## Phase Roadmap

- **Phase 1** ✅ Project setup, auth, basic 3D world, movement
- **Phase 2** NPCs, interaction, quest system, combat, enemies
- **Phase 3** Inventory, equipment, shop, economy, save system
- **Phase 4** Daily quests, achievements, leaderboard, statistics
- **Phase 5** Admin dashboard, security, anti-cheat
- **Phase 6** Mobile controls, audio, optimization, polish

## Contributing

This is a solo development project. All code should follow:
- TypeScript strict mode
- Consistent naming conventions
- Comments for complex logic
- Server-side validation always
- No game logic in UI layer

## License

Proprietary - NEXORA © 2026
