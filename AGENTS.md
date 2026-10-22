# Pepoltek Project Architecture & Conventions

## 1. Directory Structure

### App Router (`src/app`)
- `src/app/layout.tsx`: Root HTML layout containing font definitions, metadata, and global stylesheets.
- `src/app/(main)/layout.tsx`: Layout wrapper for the main landing page and marketing routes (mounts `Header.tsx`, wrappers, and future `Footer.tsx`).
- `src/app/(main)/page.tsx`: Main landing page composed of section components.
- Future sub-pages (e.g. `solutions`, `about`, etc.) should be organized within their respective route groups or sub-directories inside `src/app`.

### Components (`src/components`)
- **Main Page Sections (`src/components/main/sections/`)**:
  - All landing page section components (`Hero.tsx`, `Overview.tsx`, `Solutions.tsx`, `TechHealthcare.tsx`, etc.) reside directly in `src/components/main/sections/` as single-file components built with Tailwind CSS.
- **Main Layout Elements (`src/components/main/`)**:
  - Layout shell components like `Header.tsx` and future `Footer.tsx` reside directly in `src/components/main/`.
- **Shared / UI Components (`src/components/`)**:
  - Reusable visual/canvas elements (such as `GlobeVisual.tsx`, `CursorGrid.tsx`) or reusable primitives reside in `src/components/` (or `src/components/ui/`).

## 2. Design System & Tokens
- **Theme Variables** (configured in `src/app/globals.css` with `@theme`):
  - `--color-ink`: `#0a1428`
  - `--color-ink-soft`: `#3d4c68`
  - `--color-electric`: `#0a84ff`
  - `--color-electric-bright`: `#38bdf8`
  - `--color-canvas`: `#eef4fd`
  - Fonts: `var(--font-sora)` (display), `var(--font-inter)` (body), `var(--font-jetbrains-mono)` (mono).
- **Aesthetic**:
  - High-precision enterprise tech and healthcare aesthetic.
  - Light canvas background (`#eef4fd`) with crisp typography, deep ink (`#0a1428`), and electric blue accents (`#0a84ff`).
  - Interactive micro-animations (e.g. `CursorGrid`, `GlobeVisual`, floating nodes, word-wave animations).

## 3. Package Manager & Validation Rules
- **npm** is the primary package manager (`npm run dev`, `npm install`).
- **CRITICAL: NEVER run `npm run build`** during tasks or verification. The user has the dev server (`npm run dev`) active.
- For code and type validation, **ONLY run typecheck** (`npm run typecheck` or `npx tsc --noEmit`).

## 4. Typography & Copywriting Rules
- **CRITICAL: ABSOLUTELY NO EM DASHES (`—`) OR EN DASHES (`–`)**:
  - Per SRS Section 3.4 UX Goals (*"Absolutely No Em Dashes"*), never use em dashes or en dashes anywhere in public UI copy, static paragraphs, titles, headings, badges, or documentation.
  - Just write natural, clean text with standard, natural sentence structure. Avoid awkward hyphens or unnecessary punctuation.
  - Any static public-facing text containing an em dash must be rewritten into natural, clean text.

## 5. Agent Interaction & Execution Rules
- **NEVER ask questions**: Never stop or block to ask questions. Act directly and decisively according to the user's instructions.
- **Focus strictly on the instructed section**: When the user specifies a section, only work on that section and its direct requirements.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
