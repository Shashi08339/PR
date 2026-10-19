import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: any) {
  try {
    const token = await getToken({ req });
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo");
    const prNumber = searchParams.get("pr");

    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!repo || !prNumber) {
      return NextResponse.json({ error: "Missing repo or pr parameter" }, { status: 400 });
    }

    // GitHub returns the raw patch/diff text if we pass the correct media type header!
    const response = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Accept: "application/vnd.github.v3.diff", // This tells GitHub to send raw diff code!
        "User-Agent": "PR-Lens-App",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch diff text from GitHub" }, { status: response.status });
    }

    const diffText = await response.text();
    return NextResponse.json({ diff: diffText });
  } catch (error) {
    console.error("Error fetching diff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}