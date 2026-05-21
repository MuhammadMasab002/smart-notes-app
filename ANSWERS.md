# Smart Notes App - Assessment Answers

## 1. How to run

Prerequisite: Node.js 18+.

Commands for a fresh machine:

```bash
git clone https://github.com/MuhammadMasab002/smart-notes-app.git
cd smart-notes-app
npm install
npx prisma migrate dev --name init
npm run dev
```

Then open:

```text
http://localhost:3000
```

Prisma creates the SQLite database automatically on the first migration, so there is no manual database setup.

## 2. Stack choice

Next.js + Prisma + SQLite was the simplest stack for this assessment.

Next.js works well here because it handles both the frontend and API routes in one project, so there is no separate server to build, wire up, or deploy. Prisma gives clean, type-safe database access and avoids raw SQL for basic note operations. SQLite is a good fit because it needs no credentials, no extra database service, and no running server, which makes the project easy for an assessor to install and run locally. Using JavaScript only keeps the stack consistent from UI to API to database access.

A separate Express backend plus PostgreSQL would be overkill at this scale. It would add more moving parts, require a running database server, and make the project harder to bootstrap quickly on a local machine. For a small assessment app, that is unnecessary complexity.

## 3. One real edge case

When updating a note through PUT `/api/notes/:id`, only the fields actually sent in the request body are updated. That logic is built in [src/app/api/notes/[id]/route.js](src/app/api/notes/[id]/route.js#L46) where the update data object is created, and then filled conditionally for each field.

The conditional checks for `title`, `content`, and `pinned` are in the same update section of [src/app/api/notes/[id]/route.js](src/app/api/notes/[id]/route.js#L49) and [src/app/api/notes/[id]/route.js](src/app/api/notes/[id]/route.js#L74). If this were not done, a PATCH-style update that only sent `pinned` could accidentally wipe out `title` and `content` when those fields were omitted from the request body.

## 4. AI usage

AI was used during the project, and I am listing that openly:

- GitHub Copilot was used in VS Code to generate the API route boilerplate for [src/app/api/notes/route.js](src/app/api/notes/route.js) and [src/app/api/notes/[id]/route.js](src/app/api/notes/[id]/route.js).
- Claude AI was used to plan the project architecture, folder structure, and step-by-step implementation guidance.
- Loveable AI was used to generate the frontend UI components.

One thing I changed manually was the note list ordering in [src/app/api/notes/route.js](src/app/api/notes/route.js#L35). The AI-generated GET handler did not include sorting at first, so I added the `orderBy` clause manually to sort pinned notes first and then sort by `updatedAt` descending. Without that, the default Prisma result order would not guarantee pinned notes appear first.

## 5. Honest gap

The frontend and backend integration could be more robust.

There is no global error boundary on the frontend, so if an API call fails silently, the user may not see clear feedback. The next fix would be to add a toast notification system and wrap all fetch calls in a shared error handler utility so failures always surface to the user.

The search field also does not use input debouncing yet. With a larger number of notes, that would send too many API requests. I would fix that with a 300ms debounce.
