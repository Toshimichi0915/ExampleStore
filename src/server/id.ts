import { getCookie, setCookie } from "cookies-next"
import { IncomingMessage, ServerResponse } from "http"
import crypto from "crypto"

export function getUserId(req: IncomingMessage, res: ServerResponse): string | undefined {
  let uid = getCookie("uid", { req, res })

  const origin = req.headers.origin
  if (origin && origin !== process.env.NEXTAUTH_URL) {
    uid = undefined
  } else if (!uid) {
    uid = crypto.randomUUID()
    const expires = new Date()
    expires.setMonth(expires.getMonth() + 1)
    setCookie("uid", uid, { req, res, expires, httpOnly: true, secure: true, sameSite: "strict" })
  }

  if (typeof uid === "boolean") {
    uid = undefined
  }

  return uid
}
