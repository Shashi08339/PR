import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * Shared NextAuth configuration.
 *
 * IMPORTANT: the GitHub access token is intentionally kept ONLY on the
 * server-side JWT (via the `jwt` callback) and is never copied into the
 * `session` object. This prevents the token — which has broad `repo` scope —
 * from being readable by client-side JavaScript via `useSession()`.
 *
 * Server-side route handlers should read the token with
 * `getToken({ req })` from "next-auth/jwt", the same way
 * app/api/repos, app/api/prs, and app/api/diff already do.
 */
export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // "repo" is required to comment on private-repo PRs. If you only need
      // to support public repos, narrow this to "public_repo" instead.
      authorization: { params: { scope: "repo,user" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Deliberately does NOT attach accessToken to `session` — see note above.
  },
};
