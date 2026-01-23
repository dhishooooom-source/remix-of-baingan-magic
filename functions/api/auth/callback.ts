import { Context } from "../../types";

export async function onRequestGet(context: Context) {
    const clientId = context.env.GITHUB_CLIENT_ID;
    const clientSecret = context.env.GITHUB_CLIENT_SECRET;
    const url = new URL(context.request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    if (!clientId || !clientSecret) {
        return new Response("Missing secrets", { status: 500 });
    }

    try {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Baingan-CMS"
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
            }),
        });

        const result = await response.json();

        if (result.error) {
            return new Response(JSON.stringify(result), { status: 400 });
        }

        const token = result.access_token;

        // Redirect back to the production admin page with the token
        return Response.redirect(`https://baingan.wtf/ullu-admin/auth?token=${token}`, 302);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(errorMessage, { status: 500 });
    }
}
