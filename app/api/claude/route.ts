import { NextRequest, NextResponse } from "next/server";
import { getLabApp } from "@songtradr/massivemusic-labs/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, max_tokens } = await request.json();

    const labApp = await getLabApp(request, process.env.LABS_APP_API_KEY);

    const anthropicApiKey = labApp.secrets.find(
      (s) => s.key === "ANTHROPIC_API_KEY",
    )?.value;

    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not found in lab app secrets" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 4000,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Claude API error: ${error}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
