/**
 * Centralized Administrative Configuration & Credentials Helper
 * Reads directly from .env variables: ADMIN_EMAIL & ADMIN_PASSWORD
 */

export interface AdminCredentials {
  email: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials {
  const email =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.ADMIN_EMAIL ||
        import.meta.env?.VITE_ADMIN_EMAIL ||
        import.meta.env?.NEXT_PUBLIC_ADMIN_EMAIL)) ||
    (typeof process !== 'undefined' &&
      (process.env?.ADMIN_EMAIL ||
        process.env?.VITE_ADMIN_EMAIL ||
        process.env?.NEXT_PUBLIC_ADMIN_EMAIL)) ||
    'limon@technobd.com';

  const password =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.ADMIN_PASSWORD ||
        import.meta.env?.VITE_ADMIN_PASSWORD ||
        import.meta.env?.NEXT_PUBLIC_ADMIN_PASSWORD)) ||
    (typeof process !== 'undefined' &&
      (process.env?.ADMIN_PASSWORD ||
        process.env?.VITE_ADMIN_PASSWORD ||
        process.env?.NEXT_PUBLIC_ADMIN_PASSWORD)) ||
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
