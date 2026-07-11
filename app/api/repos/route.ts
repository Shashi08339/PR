import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: any) {
  try {
    // 1. Extract the secure JWT token from the user's request cookie
    const token = await getToken({ req });

    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized: Missing GitHub token" }, { status: 401 });
    }

    // 2. Hit the official GitHub API using the user's personal access token
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "PR-Lens-App", // GitHub requires a User-Agent header
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to fetch repos from GitHub" }, { status: response.status });
    }

    const repos = await response.json();

    // 3. Clean up the data to only send what our frontend UI needs
    const cleanRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      url: repo.html_url,
    }));

    return NextResponse.json({ repos: cleanRepos });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}