# kitrack-auth

Système d'authentification centralisé pour l'écosystème KITRACK.

Déployé sur [auth.kitrack.ing](https://auth.kitrack.ing).

## Stack

- **Framework** : Next.js 16 (App Router)
- **Auth & DB** : Supabase
- **Styling** : Tailwind CSS v4
- **Runtime** : Node.js 22.x
- **Déploiement** : Vercel (team kitrack-projects)

## Démarrage local

```bash
cp .env.local.example .env.local
# Remplir les variables d'environnement Supabase

npm install
npm run dev
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase (server-side only) |
