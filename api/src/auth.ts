import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { ClientPrincipal } from "./types.js";

/**
 * Returns a real SWA principal or a local CI test principal.
 */
export function getClientPrincipal(req: HttpRequest): ClientPrincipal | null {
  const authMode = process.env.AUTH_MODE ?? "swa";

  // ---------------------------------
  // Local CI / Docker / Playwright mode
  // ---------------------------------
  if (authMode === "test") {
    const userId = req.headers.get("x-test-user-id") ?? "playwright-user";

    const userDetails =
      req.headers.get("x-test-user-name") ?? "Playwright User";

    const rolesHeader =
      req.headers.get("x-test-user-roles") ?? "authenticated,editor";

    return {
      identityProvider: "test",
      userId,
      userDetails,
      userRoles: rolesHeader.split(",").map((r) => r.trim()),
      claims: [],
    };
  }

  // ---------------------------------
  // Real Static Web Apps mode
  // ---------------------------------
  const header = req.headers.get("x-ms-client-principal");
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    const principal: ClientPrincipal = JSON.parse(decoded);
    return principal;
  } catch {
    return null;
  }
}

/**
 * Checks if the client has at least one required role.
 */
export function requireRole(
  principal: ClientPrincipal | null,
  roles: string[]
): HttpResponseInit | null {
  if (!principal) {
    return { status: 401, body: "Unauthorized" };
  }

  const hasRole = roles.some((role) =>
    principal.userRoles.includes(role)
  );

  if (!hasRole) {
    return {
      status: 403,
      body: "Forbidden: insufficient role",
    };
  }

  return null;
}