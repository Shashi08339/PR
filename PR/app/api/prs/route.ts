import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: any) {
  try {
    const token = await getToken({ req });
    const { searchParams } = new URL(req.url);
    const repoFullName = searchParams.get("repo"); // Expecting "username/repo-name"

    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!repoFullName) {
      return NextResponse.json({ error: "Missing repository parameter" }, { status: 400 });
    }

    // Hit the GitHub API for open Pull Requests
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/pulls?state=open&per_page=10`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "PR-Lens-App",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch PRs from GitHub" }, { status: response.status });
    }

    const prs = await response.json();

    const cleanPrs = prs.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user.login,
      url: pr.html_url,
      diffUrl: pr.diff_url,
    }));

    return NextResponse.json({ prs: cleanPrs });
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}