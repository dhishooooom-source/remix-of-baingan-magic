export async function onRequestGet(context) {
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

        // Redirect back to the admin page with the token
        // Dynamic based on host
        const origin = new URL(context.request.url).origin;
        return Response.redirect(`${origin}/ullu-admin/auth?token=${token}`, 302);

    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
}
