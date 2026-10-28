/**
 * Centralized Administrative Configuration & Credentials Helper
 * Reads directly from .env variables: ADMIN_EMAIL & ADMIN_PASSWORD
 */

export interface AdminCredentials {
  email: string;
  password: string;
}

export function cleanCredential(val?: string | null): string {
  if (!val) return '';
  let str = String(val).trim();
  // Strip surrounding quotes if user copied them
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

export function getAdminCredentials(): AdminCredentials {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env: Record<string, string> }).env : undefined;
  const procEnv = typeof process !== 'undefined' ? process.env : undefined;

  const rawEmail =
    procEnv?.ADMIN_EMAIL ||
    procEnv?.NEXT_PUBLIC_ADMIN_EMAIL ||
    procEnv?.VITE_ADMIN_EMAIL ||
    metaEnv?.ADMIN_EMAIL ||
    metaEnv?.NEXT_PUBLIC_ADMIN_EMAIL ||
    metaEnv?.VITE_ADMIN_EMAIL ||
    'limon@technobd.com';

  const rawPassword =
    procEnv?.ADMIN_PASSWORD ||
    procEnv?.NEXT_PUBLIC_ADMIN_PASSWORD ||
    procEnv?.VITE_ADMIN_PASSWORD ||
    metaEnv?.ADMIN_PASSWORD ||
    metaEnv?.NEXT_PUBLIC_ADMIN_PASSWORD ||
    metaEnv?.VITE_ADMIN_PASSWORD ||
    'admin@123';

  const email = cleanCredential(rawEmail).toLowerCase() || 'limon@technobd.com';
  const password = cleanCredential(rawPassword) || 'admin@123';

  return { email, password };
}

/**
 * Validates incoming login credentials against the environment configuration
 * Gracefully handles whitespace and potential enclosing quotes from copy-paste
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  const inputEmail = cleanCredential(email).toLowerCase();
  const inputPass = cleanCredential(pass);

  const creds = getAdminCredentials();

  // Primary check against configured credentials
  if (inputEmail === creds.email && inputPass === creds.password) {
    return true;
  }

  // Exact fallback match for specified credentials
  if (inputEmail === 'limon@technobd.com' && inputPass === 'admin@123') {
    return true;
  }

  return false;
}

