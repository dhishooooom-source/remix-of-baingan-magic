import { onRequestGet as __api_auth_callback_ts_onRequestGet } from "C:\\Users\\dhish\\Desktop\\baingan\\functions\\api\\auth\\callback.ts"
import { onRequestGet as __api_auth_login_ts_onRequestGet } from "C:\\Users\\dhish\\Desktop\\baingan\\functions\\api\\auth\\login.ts"
import { onRequestDelete as __api_github_delete_ts_onRequestDelete } from "C:\\Users\\dhish\\Desktop\\baingan\\functions\\api\\github\\delete.ts"
import { onRequestGet as __api_github_files_ts_onRequestGet } from "C:\\Users\\dhish\\Desktop\\baingan\\functions\\api\\github\\files.ts"
import { onRequestPost as __api_github_write_ts_onRequestPost } from "C:\\Users\\dhish\\Desktop\\baingan\\functions\\api\\github\\write.ts"

export const routes = [
    {
      routePath: "/api/auth/callback",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_callback_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestGet],
    },
  {
      routePath: "/api/github/delete",
      mountPath: "/api/github",
      method: "DELETE",
      middlewares: [],
      modules: [__api_github_delete_ts_onRequestDelete],
    },
  {
      routePath: "/api/github/files",
      mountPath: "/api/github",
      method: "GET",
      middlewares: [],
      modules: [__api_github_files_ts_onRequestGet],
    },
  {
      routePath: "/api/github/write",
      mountPath: "/api/github",
      method: "POST",
      middlewares: [],
      modules: [__api_github_write_ts_onRequestPost],
    },
  ]