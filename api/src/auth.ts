// api/auth.ts
import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { ClientPrincipal } from "./types.js";

/**
 * Decodes the x-ms-client-principal header and returns the ClientPrincipal object.
 */
export function getClientPrincipal(req: HttpRequest): ClientPrincipal | null {
  const header = req.headers.get("x-ms-client-principal");
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("ascii");
    const principal: ClientPrincipal = JSON.parse(decoded);
    return principal;
  } catch {
    return null;
  }
}

/**
 * Checks if the client has at least one of the required roles.
 * Returns a HttpResponseInit if unauthorized, otherwise null.
 */
export function requireRole(
  principal: ClientPrincipal | null,
  roles: string[]
): HttpResponseInit | null {
  if (!principal) {
    return { status: 401, body: "Unauthorized" };
  }

  const hasRole = roles.some((role) => principal.userRoles.includes(role));
  if (!hasRole) {
    return { status: 403, body: "Forbidden: insufficient role" };
  }

  return null;
}
