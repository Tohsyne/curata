// Shared between the claim form (client-side UX) and the auth callback
// (server-side enforcement — the only check that actually matters).
const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])?$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}
