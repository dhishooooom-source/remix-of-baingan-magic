import { Context } from "../../types";

export async function onRequestGet(context: Context) {
    const clientId = context.env.GITHUB_CLIENT_ID;

    // Hardcoded production callback for GitHub OAuth App matching
    const redirectUri = "https://baingan.wtf/api/auth/callback";

    const scope = "repo";

    if (!clientId) {
        return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    return Response.redirect(url, 302);
}
