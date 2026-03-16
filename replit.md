# Portfolio - Ranja Herimandimby Lioka ANDRIAMIADANA

## Overview

Portfolio personnel ultra-moderne pour Ranja Andriamiadana, développeur junior en Génie Logiciel. Application full-stack avec système d'authentification JWT et panel d'administration pour gérer les projets dynamiquement.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TypeScript (artifacts/portfolio)
- **Backend API**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Animations**: Framer Motion + Three.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)

## Structure

```text
artifacts/
├── portfolio/          # Frontend React portfolio (port from env PORT)
│   ├── src/
│   │   ├── pages/      # Home, Projects, ProjectDetail, About, Login, Setup, Admin
│   │   ├── components/ # AppLayout, ProjectCard, UI components
│   │   ├── hooks/      # use-portfolio-api.ts (React Query hooks)
│   │   └── lib/        # auth-context.tsx, utils.ts
│   └── public/images/  # Generated images (hero, avatar)
└── api-server/         # Express backend (port 8080)
    └── src/
        ├── routes/     # auth.ts, projects.ts, profile.ts, skills.ts, health.ts
        ├── lib/        # jwt.ts (token signing/verification)
        └── middlewares/# auth.ts (requireAuth middleware)

lib/
├── api-spec/           # OpenAPI spec (openapi.yaml) + Orval config
├── api-client-react/   # Generated React Query hooks
├── api-zod/            # Generated Zod schemas
└── db/
    └── src/schema/     # users, projects, project_media, profile, skills
```

## Key Features

### Public Portfolio
- **/** : Hero section avec animation 3D géométrique, nom en gradient
- **/projects** : Grille de projets avec filtres par catégorie
- **/projects/:id** : Détail projet avec galerie médias
- **/about** : Bio, compétences, timeline académique

### Authentication & Admin
- **/setup** : Création du premier admin (auto-redirect si aucun admin)
- **/login** : Login cinématique sombre avec effets glow JWT
- **/admin** : Dashboard admin protégé (gestion projets, médias, compétences, profil)

### Admin Dashboard
- Créer/modifier/supprimer des projets
- Ajouter des médias (image URL, vidéo URL, YouTube) avec preview
- Gérer les compétences
- Modifier le profil

## API Routes

All prefixed with `/api`:
- `GET /api/auth/needs-setup` - Check if admin setup needed
- `POST /api/auth/setup` - Create first admin
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/media` - Add media (protected)
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile (protected)
- `GET /api/skills` - List skills
- `POST /api/skills` - Create skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

## Security

- JWT tokens signed with `JWT_SECRET` env var (default fallback provided)
- Passwords hashed with bcryptjs (12 rounds)
- Protected routes require `Authorization: Bearer <token>` header
- Token stored in localStorage on frontend

## Database Schema

- `users` - Admin users (username, password_hash, email)
- `projects` - Portfolio projects (title, description, category, year, technologies JSON, github/demo URLs, color, icon, cover_image, featured)
- `project_media` - Project media files (project_id, type: image/video/youtube, url, caption, order)
- `profile` - Owner profile (name, title, bio, email, phone, location, github, linkedin, avatar)
- `skills` - Technical skills (name, category, level 0-100, icon, color)

## Pre-seeded Data

- 9 projects from CV (Hackathons, Desktop Apps, Web Apps)
- 14 skills (Languages, Frameworks, Databases, Tools)
- Profile auto-created on first GET /api/profile

## Development

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start portfolio frontend
pnpm --filter @workspace/portfolio run dev

# Push DB schema changes
pnpm --filter @workspace/db run push

# Run codegen after OpenAPI changes
pnpm --filter @workspace/api-spec run codegen
```

## User Preferences

- Language: French (interface et commentaires)
- Dark mode: Default theme (deep blacks #0a0a0a, electric blue/cyan accents)
- Font: Space Grotesk (headings) + Inter (body)
- Animations: Framer Motion + géométrie 3D Three.js
