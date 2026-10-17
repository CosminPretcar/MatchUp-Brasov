/**
 * Decodes a JWT and returns its payload, or null if malformed.
 */
function decodeJwt(token: string): { exp?: number } | null {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
}

/**
 * Returns true if the JWT token is missing, malformed, or past its expiry.
 */
export function isTokenExpired(token: string | undefined | null): boolean {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  // exp is in seconds; Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Returns how many milliseconds remain until the token expires.
 * Returns 0 if the token is already expired or invalid.
 */
export function msUntilTokenExpiry(token: string | undefined | null): number {
  if (!token) return 0;
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}

