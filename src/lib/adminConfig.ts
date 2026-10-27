/**
 * Centralized Administrative Configuration & Credentials Helper
 * Reads directly from .env variables: ADMIN_EMAIL & ADMIN_PASSWORD
 */

export interface AdminCredentials {
  email: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env: Record<string, string> }).env : undefined;
  const procEnv = typeof process !== 'undefined' ? process.env : undefined;

  const email =
    metaEnv?.ADMIN_EMAIL ||
    metaEnv?.VITE_ADMIN_EMAIL ||
    metaEnv?.NEXT_PUBLIC_ADMIN_EMAIL ||
    procEnv?.ADMIN_EMAIL ||
    procEnv?.VITE_ADMIN_EMAIL ||
    procEnv?.NEXT_PUBLIC_ADMIN_EMAIL ||
    'limon@technobd.com';

  const password =
    metaEnv?.ADMIN_PASSWORD ||
    metaEnv?.VITE_ADMIN_PASSWORD ||
    metaEnv?.NEXT_PUBLIC_ADMIN_PASSWORD ||
    procEnv?.ADMIN_PASSWORD ||
    procEnv?.VITE_ADMIN_PASSWORD ||
    procEnv?.NEXT_PUBLIC_ADMIN_PASSWORD ||
    'admin@123';

  return {
    email: String(email).trim().toLowerCase(),
    password: String(password).trim(),
  };
}

/**
 * Validates incoming login credentials against the environment configuration
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  const creds = getAdminCredentials();
  return (
    email.trim().toLowerCase() === creds.email &&
    pass.trim() === creds.password
  );
}
