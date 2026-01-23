export async function onRequestDelete(context) {
    const origin = context.request.headers.get("Origin");
    const allowedOrigins = ["https://baingan.wtf", "http://localhost:5173", "http://127.0.0.1:5173"];

    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://baingan.wtf",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "DELETE, OPTIONS"
    };

    if (context.request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const token = context.request.headers.get("Authorization");
    if (!token) {
        return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }

    const repo = context.env.GITHUB_REPO;
    const url = new URL(context.request.url);
    const path = url.searchParams.get("path");
    const sha = url.searchParams.get("sha");
    const message = "Delete file via Baingan CMS";

    if (!path || !sha) {
        return new Response("Missing path or sha for deletion", { status: 400, headers: corsHeaders });
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    try {
        const ghResponse = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Authorization": token,
                "User-Agent": "Baingan-CMS",
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                sha
            })
        });

        const result = await ghResponse.json();

        return new Response(JSON.stringify(result), {
            status: ghResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}
