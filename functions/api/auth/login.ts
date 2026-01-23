export async function onRequestGet(context) {
    const clientId = context.env.GITHUB_CLIENT_ID;

    // Dynamic redirect URI based on current host
    const requestUrl = new URL(context.request.url);
    const baseUrl = requestUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/callback`;

    const scope = "repo";

    if (!clientId) {
        return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    return Response.redirect(url, 302);
}
