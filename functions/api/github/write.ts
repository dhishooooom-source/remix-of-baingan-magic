export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin");
    const allowedOrigins = ["https://baingan.wtf", "http://localhost:5173", "http://127.0.0.1:5173"];

    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://baingan.wtf",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (context.request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const token = context.request.headers.get("Authorization");
    if (!token) {
        return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }

    const repo = context.env.GITHUB_REPO;

    try {
        const { path, content, message, sha } = await context.request.json();

        if (!path || !content || !message) {
            return new Response("Missing path, content, or message", { status: 400, headers: corsHeaders });
        }

        // Prepare payload
        // Content must be base64 encoded
        const encodedContent = btoa(unescape(encodeURIComponent(content))); // Handle UTF-8

        const body: any = {
            message,
            content: encodedContent,
        };

        // If updating, sha is required. We might need to fetch it first if not provided, 
        // but the frontend should provide it ideally. 
        // If not provided, this tries to create new. If exists, it fails.
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

        // If SHA is missing, try to fetch it first to allow upsert (overwrite)
        if (!sha) {
            try {
                const getRes = await fetch(apiUrl, {
                    headers: {
                        "Authorization": token,
                        "User-Agent": "Baingan-CMS",
                        "Accept": "application/vnd.github.v3+json"
                    }
                });
                if (getRes.ok) {
                    const existingData = await getRes.json();
                    body.sha = existingData.sha;
                }
            } catch (e) {
                // Ignore error if file doesn't exist, just create new
            }
        } else {
            body.sha = sha;
        }

        const ghResponse = await fetch(apiUrl, {
            method: "PUT", // GitHub uses PUT for creating/updating files
            headers: {
                "Authorization": token,
                "User-Agent": "Baingan-CMS",
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
