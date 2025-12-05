# Employee Management FE

React + Vite frontend for the employee management system. Requires the backend to be running first.

## Prerequisites
- Node.js 18+
- Yarn v1
- Backend running on `http://localhost:3000` (start `../be-employee-management-system` first)
- Environment variable `VITE_API_BASE_URL`

## Environment
| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Backend base URL (used for HTTP + WS) | `http://localhost:3000` |

## Setup
```bash
yarn install
cp .env.example .env.local  # adjust VITE_API_BASE_URL if backend port differs
```

## Scripts
- `yarn dev` — start Vite dev server.
- `yarn build` — production build.
- `yarn preview` — preview the production build.
- `yarn lint` — run Biome lint.
- `yarn format` — run Biome format.
- `yarn check` — run Biome check.
- `yarn test` — run Vitest unit tests.
- `yarn test:watch` — watch tests.
- `yarn test:coverage` — run tests with coverage.

## Running locally
1) Start backend: from `../be-employee-management-system` run `yarn dev` (or your start command) and verify it listens on the port in `VITE_API_BASE_URL`.
2) Start frontend: `yarn dev` in this folder, then open the URL Vite prints (default http://localhost:5173).
3) Login using the backend’s seeded credentials (see backend README).

## Project layout
- `src/auth` — Auth context.
- `src/hooks` — Data hooks (React Query).
- `src/components` — UI components and modals.
- `src/pages` — Route-level pages.
- `src/lib` — API + notification clients.
- `src/test` — Unit tests (Vitest + Testing Library).

## Development notes
- Sorting/search/pagination call the backend; ensure BE supports the query params used in `src/lib/api.ts`.
- Notifications use WebSocket at `${VITE_API_BASE_URL}/ws/notifications`; BE must be running for realtime updates.
- Tests use jsdom and stub globals in `src/test/setupTests.ts`.
