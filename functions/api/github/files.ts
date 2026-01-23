import { Context } from "../../types";

export async function onRequestGet(context: Context) {
    // CORS Check - allow localhost for dev
    const origin = context.request.headers.get("Origin") || "";
    const allowedOrigins = ["https://baingan.wtf", "http://localhost:5173", "http://127.0.0.1:5173"];

    const corsHeaders: Record<string, string> = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://baingan.wtf",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };

    // If we want to support localhost during dev, we might check context.env.ENVIRONMENT or similar
    // For now, hardcoding as requested, but adding logic to return early if OPTIONS (browser preflight)
    if (context.request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const token = context.request.headers.get("Authorization");
    if (!token) {
        return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }

    const repo = context.env.GITHUB_REPO;
    const url = new URL(context.request.url);
    const path = url.searchParams.get("path") || "content/ullu"; // Default to listing the folder

    // Create GitHub API URL
    // If listing a folder: GET /repos/{owner}/{repo}/contents/{path}
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    try {
        const ghResponse = await fetch(apiUrl, {
            headers: {
                "Authorization": token, // Pass the Bearer token
                "User-Agent": "Baingan-CMS",
                "Accept": "application/vnd.github.v3+json"
            }
        });

        const data = await ghResponse.json();

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: ghResponse.status
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}
