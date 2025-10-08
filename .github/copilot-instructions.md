## Repository: lims_fe — Copilot / AI assistant instructions

This file gives focused, actionable guidance for AI coding agents working on the `lims_fe` (Land Information Management System) frontend.

Keep suggestions concise and make edits only when confident. When unsure about backend contracts, prefer adding TODOs and small, non-breaking changes.

Key facts
- Language & toolchain: React 19 + Vite. Entry: `src/main.jsx`. Start: `npm run dev` (script: `vite`).
- Styling: Tailwind + daisyUI classes in components (see `src/App.css`).
- State: Redux Toolkit with a single `auth` slice in `src/utils/userSlice.jsx`. Store created in `src/utils/store.jsx` and provided in `src/main.jsx`.
- Routing: `react-router-dom` v7 with central route definitions in `src/App.jsx`. Protected routes use `src/routes/PrivateRoute.jsx` and an `AuthProvider` in `src/context/AuthContext.jsx`.
- Backend: app talks to a separate API (examples: login POST to `http://localhost:3000/api/auth/login` in `src/pages/LandingPage.jsx`). Do not change API endpoints without coordination.
- Firebase is initialized in `src/utils/firebase.js` but not heavily used — treat as optional integration point.

What to change vs. what to avoid
- Safe: small UI fixes, prop forwarding, component extraction, Tailwind class adjustments, wiring new routes that match existing layout patterns.
- Avoid: changing authentication flows, removing localStorage keys (`authToken`, `user`, `userToken`, `userToken` names vary across files), or changing API contracts. If necessary, create migrations and feature flags.

Patterns & conventions (examples)
- Auth persistence: the project uses both localStorage and Redux. Keys used:
  - `localStorage.setItem('authToken', ...)` (used in `src/pages/LandingPage.jsx`)
  - `localStorage.setItem('user', JSON.stringify(user))` (same file)
  - `localStorage.getItem('userToken')` (used in `src/utils/userSlice.jsx`)
  - `localStorage.getItem('authToken')` (fallback usage in `src/routes/PrivateRoute.jsx`)
  When updating auth code, update all places and keep backward-compatible fallbacks.

- Protected routes: `PrivateRoute` reads from Redux `state.auth` and also falls back to localStorage. It expects user role shaped as either `user.role_name` or `user.role?.name` or `user.role`. Example: see `src/routes/PrivateRoute.jsx`.

- Layout: All protected routes render inside `components/layout/Layout.jsx` via an `Outlet`. Layout controls sidebar width and header title mapping. When adding pages, register routes in `src/App.jsx` and add titles in `Layout.jsx`'s `pageTitles` map if needed.

- API usage: network calls often use the browser `fetch` API directly (see `src/pages/LandingPage.jsx`, `src/hooks/useFetch.jsx`). Keep request/response handling explicit; prefer small adapters when introducing shared API helpers.

Developer workflows
- Start dev server (Windows PowerShell):
  - npm run dev
- Build for production:
  - npm run build
- Linting (ESLint configured):
  - npm run lint

Debugging notes
- Redux: store is created in `src/utils/store.jsx`. Use the browser Redux DevTools to inspect `auth` slice.
- Authentication bugs often arise from mismatched storage key names; check `LandingPage.jsx`, `userSlice.jsx`, and `PrivateRoute.jsx` together.
- To reproduce login flows locally, backend must be running at the URL used in `LandingPage.jsx` (default: `http://localhost:3000`). If backend URL differs, search for `localhost:3000` in repo and update consistently.

Integration points & external deps
- Firebase: `src/utils/firebase.js` contains the config/initialization. Treat this as a read-only integration unless adding Firebase features.
- Recharts, papaparse, xlsx: used for charts and CSV/XLSX import flows. Check `src/pages/UploadPlots.jsx` (not present in short scan) when working on import/export.

Files you will likely read/modify
- `src/App.jsx` — routing and route protection
- `src/pages/*` — page implementations (LandingPage handles login)
- `src/context/AuthContext.jsx` — alternative context-based auth used in routing tree
- `src/routes/PrivateRoute.jsx` — core auth gate
- `src/utils/userSlice.jsx` & `src/utils/store.jsx` — Redux auth shape and persistence
- `src/components/layout/*` — Layout, Sidebar, Header conventions
- `src/utils/firebase.js` — firebase initialization

Small, helpful examples
- Add a new protected page:
  1. Create `src/pages/MyPage.jsx` following pattern of `Dashboard.jsx` (export default function with main markup).
  2. Add route in `src/App.jsx` inside the PrivateRoute Outlet: <Route path="/mypage" element={<MyPage />} />
  3. Add `"/mypage": "My Page"` to `pageTitles` in `src/components/layout/Layout.jsx`.

- Persist additional user data safely:
  - Update `userSlice` reducers to write to localStorage (follow existing `login`/`logout`), and ensure `PrivateRoute.jsx` fallback keys read the same names.

Quality gates for edits
- Ensure `npm run build` succeeds locally for larger changes.
- Run `npm run lint` and fix lint errors before opening a PR.
- Avoid changes that break route names or localStorage keys without migration steps and backward-compatible fallbacks.

If you can't find the backend contract
- Don't change endpoints. Instead, add a TODO and mock responses in a small dev helper file under `src/mocks/` and reference in the PR.

Where to ask for clarification
- If a change touches authentication, API endpoints, or data persistence, raise an issue and link to the affected files: `src/pages/LandingPage.jsx`, `src/routes/PrivateRoute.jsx`, `src/utils/userSlice.jsx`, `src/context/AuthContext.jsx`.

End of file.
