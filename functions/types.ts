export interface Env {
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_REPO: string;
}

export interface Context {
    env: Env;
    request: Request;
}
