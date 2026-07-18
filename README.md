# PR-Lens

Automate, analyze, and accelerate your development workflow. PR-Lens is a
smart developer tool that streamlines code review: it pulls a pull request's
diff straight from GitHub, sends it to Gemini for analysis, and can post the
resulting review as inline comments back on the PR — flagging risk,
complexity, and quality issues before a human ever has to.

## Project structure

```
PR-Lens/
│
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # GitHub OAuth (NextAuth)
│   │   ├── repos/route.ts                # List the user's GitHub repos
│   │   ├── prs/route.ts                  # List open PRs for a repo
│   │   ├── diff/route.ts                 # Fetch a PR's raw diff
│   │   └── review/route.ts               # Run AI review / post comments
│   ├── layout.tsx
│   ├── page.tsx                          # Main workspace UI
│   ├── providers.tsx                     # Session provider
│   └── globals.css
│
├── components/
│   ├── ui/                               # shadcn/ui primitives
│   ├── workspace/                        # App-specific UI (sidebar, cards)
│   └── theme-provider.tsx
│
├── lib/
│   ├── auth.ts                           # Shared NextAuth config
│   └── utils.ts
│
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs                    # Tailwind v4 config (CSS-based,
│                                          # no tailwind.config.ts needed)
└── .env.example
```

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a GitHub OAuth App** at
   [github.com/settings/developers](https://github.com/settings/developers)
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

3. **Get a Gemini API key** at
   [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `GITHUB_ID`, `GITHUB_SECRET`, `GEMINI_API_KEY`, and generate a
   `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000), sign in with GitHub,
   pick a repo and an open PR, and run a review.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Notes on the GitHub OAuth scope

The app requests the `repo` scope so it can comment on private-repo PRs.
That's a broad grant (read/write on every repo you own). If you only need
this against public repositories, narrow the scope in `lib/auth.ts` to
`public_repo`. For production use with many users, consider migrating to a
GitHub App with fine-grained, per-repository permissions instead.
