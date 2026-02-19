# Copilot Instructions for GetMate

## Project Overview
- GetMate is a Next.js (T3 Stack) web app for students/juniors to find collaborators by joining or starting projects.
- Key features: project creation, joining slots, tech stack tagging, filtering/search, and activity feed.
- Main UI is retro-minimalist: thick borders, 3D buttons, monospace font, and a beige palette (#E1D9BC, #F0F0DB, #30364F).

## Architecture & Data Flow
- **Pages:**
  - `src/app/page.tsx`: Home feed, filtering, sidebar activity feed.
  - `src/app/new_project/page.tsx`: Project creation form.
  - `src/app/edit-project/[id]/page.tsx`: Project editing form.
- **Components:**
  - `ProjectCard`: Displays project info, slots, tech stack, and status badge.
  - `TechStackSelector`: Tag input for tech stack (used in forms).
  - `FilterToolbar`: Search/filter UI (search, role, tech, free slots).
  - `ActivityFeed`: Recent project/user actions.
  - `UserParticipantStack`: Overlapping avatars for project participants.
  - `ProjectStatusBadge`: Shows project status (IDEA, RECRUITING, IN PROGRESS).
- **Data:**
  - Projects are fetched from Prisma DB (`db.project.findMany`).
  - User info is resolved server-side for avatars/roles.
  - Filtering is handled client-side via URL search params.

## Developer Workflows
- **Prisma:**
  - Schema: `prisma/schema.prisma` (Project model includes `techStack String[]`).
  - Migrations: `npx prisma migrate dev --name <desc>` after schema changes.
  - DB push: `npx prisma db push` for syncing schema.
- **Build/Run:**
  - Start dev server: `npm run dev` in `getmate/`.
- **Styling:**
  - Tailwind CSS is used, with custom classes for retro look.
  - Global styles in `src/styles/globals.css`.

## Patterns & Conventions
- **Forms:**
  - Use FormData for server actions (see `actions.ts`).
  - Tech stack tags are submitted as multiple `techStack` fields.
- **Filtering:**
  - Filters (search, role, tech, free slots) update URL params for shareable links.
  - Filtering logic is in `FilterToolbar` and applied client-side.
- **Component Structure:**
  - Prefer small, reusable components (see `components/`).
  - Status badges and tech tags are always rendered as styled spans.
- **Retro UI:**
  - Use thick borders (`border-2`/`border-4`), solid shadows, and monospace font.
  - Buttons have 3D effect (`shadow`, `active:translate-y-1`).

## Integration Points
- **NextAuth:** Authentication via `server/auth`.
- **Prisma:** Data access via `server/db`.
- **External Techs:** Tech stack tags are user-defined or selected from a predefined list.

## Example: Adding a New Tech Tag
- Use `TechStackSelector` in forms.
- Tags are submitted as hidden inputs (`<input name="techStack" value="..." />`).
- On project display, tags are rendered as styled badges at the bottom of `ProjectCard`.

## Key Files
- `src/app/page.tsx`, `src/app/components/ProjectCard.tsx`, `src/app/components/TechStackSelector.tsx`, `src/app/components/FilterToolbar.tsx`, `src/app/actions.ts`, `prisma/schema.prisma`

---

If any conventions or workflows are unclear, please request clarification or examples from the user.
