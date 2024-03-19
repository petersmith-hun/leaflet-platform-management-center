/**
 * Unconditionally marks all endpoint protected.
 */
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/((?!api\/actuator\/info).*)"
  ]
}
