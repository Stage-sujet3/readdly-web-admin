# readdly-web-admin

Interface **Admin** (Next.js) du projet **Readdly** dans une architecture **micro-services**.

## Pré-requis

- Node.js (LTS recommandé)
- npm

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Configuration

Copier le fichier d’exemple puis adapter les valeurs :

```bash
cp .env.example .env.local
```

Variables principales :

- `NEXT_PUBLIC_API_BASE_URL` : URL du gateway/BFF/API.

## Structure (convention)

- `src/app` : routes (App Router)
- `src/components` : composants UI réutilisables
- `src/features` : modules fonctionnels (auth, users, etc.)
- `src/lib` : utilitaires (fetcher, helpers…)
- `src/config` : configuration typée (env…)

## Scripts

- `npm run dev` : dev server
- `npm run build` : build
- `npm run start` : prod server
- `npm run lint` : eslint

## Publier sur GitHub

1) Créer un repo vide `readdly-web-admin` sur GitHub

2) Ajouter le remote puis pousser :

```bash
git remote add origin https://github.com/<ORG_OU_USER>/readdly-web-admin.git
git push -u origin main
```
