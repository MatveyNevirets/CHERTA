# Project rules

## Stack
- Next.js
- TypeScript
- PostgreSQL
- Tailwind CSS

## Rules
- Use TypeScript strict mode.
- Prefer Server Components.
- Use Client Components only when interactivity requires them.
- Never expose secrets to the client.
- Do not use any unless necessary.
- Keep components small.
- Before finishing a task run:
  - npm run lint
  - npm run build

## Architecture
- app/ — routes
- components/ — reusable UI
- lib/ — server logic and database