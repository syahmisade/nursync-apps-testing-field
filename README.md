# NurSync

A nursing reference and study companion. NurSync gives nurses and nursing
students quick, searchable access to a medicine formulary, clinical
calculators, procedure guides, and self-assessment quizzes — all in one app,
with the ability to save items for later and track quiz progress.

Built on [Base44](https://base44.com): the React front end in this repo talks
to Base44-hosted data entities, and any change pushed to this repo is also
reflected in the Base44 Builder.

## Features

- **Medicine formulary** — browse and search medicines by category, with
  indications, dosage, contraindications, adverse reactions, interactions, and
  more.
- **Clinical calculators** — common bedside calculations.
- **Procedures** — step-by-step procedure references.
- **Quizzes** — categorized questions with attempt tracking.
- **Saved items** — bookmark medicines and procedures for quick recall.
- **Accounts** — register / log in, password reset, and a profile screen.
- **Admin panel** — manage catalog content and review user feedback.

## Tech stack

- **React 18** + **Vite 6** (JavaScript, JSX)
- **Tailwind CSS** with **Radix UI** primitives
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Framer Motion** for animation
- **@base44/sdk** for the backend (entities, auth, functions)

## Getting started

**Prerequisites:** Node.js 18+ and npm.

1. Clone the repository and enter the project directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example env file and fill in your own values:
   ```
   cp .env.example .env.local
   ```
   `.env.local` is gitignored — never commit real credentials.
4. Start the dev server:
   ```
   npm run dev
   ```
   The app runs at http://localhost:5173.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_BASE44_APP_ID` | Yes | Your Base44 app ID (the string between `/apps/` and `/editor/` in the app URL). |
| `VITE_BASE44_API_KEY` | Option A | App API key from Base44. When set, the client authenticates directly against the hosted backend (`https://base44.app`). Best for standalone local dev. |
| `VITE_BASE44_APP_BASE_URL` | Option B | Your app's backend URL (e.g. `https://my-app-xxxxxxxx.base44.app`). Use this instead of an API key to route requests through the dev proxy. |

Set **either** `VITE_BASE44_API_KEY` (Option A) **or** `VITE_BASE44_APP_BASE_URL`
(Option B) alongside `VITE_BASE44_APP_ID`.

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run lint:fix` | Run ESLint and auto-fix. |
| `npm run typecheck` | Type-check with the TypeScript compiler. |

## Project structure

```
src/
  pages/       Top-level routes (NurSync shell, Login, Register, …)
  screens/     Feature screens (Medicine, Calculators, Procedures, Quiz, Saved, Profile, Admin)
  components/  Reusable UI (incl. Radix-based primitives under components/ui)
  hooks/       Data hooks (useMedicines, useProcedures, …)
  api/         Base44 client setup
  lib/         Auth context, query client, helpers
  context/     Theme provider
base44/
  entities/    Base44 data-model definitions (Medicine, Procedure, Quiz*, SavedItem, User, Feedback)
```

## Publishing

Open [Base44.com](https://base44.com) and click **Publish**, or push to this
repo — changes sync to the Base44 Builder automatically.

## Docs & support

- Base44 + GitHub: https://docs.base44.com/Integrations/Using-GitHub
- Support: https://app.base44.com/support
