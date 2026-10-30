/**
 * Administrative credentials helper.
 * Credentials come only from environment variables — never hardcoded.
 *
 * Server: ADMIN_EMAIL / ADMIN_PASSWORD (Cloudflare secrets or .env)
 * Optional client: NEXT_PUBLIC_ADMIN_EMAIL / NEXT_PUBLIC_ADMIN_PASSWORD
 */

export interface AdminCredentials {
  email: string;
  password: string;
}

export function cleanCredential(val?: string | null): string {
  if (!val) return '';
  let str = String(val).trim();
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

function readEnv(...keys: string[]): string {
  const metaEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      : undefined;
  const procEnv = typeof process !== 'undefined' ? process.env : undefined;

  for (const key of keys) {
    const fromProcess = procEnv?.[key];
    if (fromProcess) return cleanCredential(fromProcess);
    const fromMeta = metaEnv?.[key];
    if (fromMeta) return cleanCredential(fromMeta);
  }
  return '';
}

export function getAdminCredentials(): AdminCredentials {
  const email = readEnv(
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_ADMIN_EMAIL',
    'VITE_ADMIN_EMAIL'
  ).toLowerCase();

  const password = readEnv(
    'ADMIN_PASSWORD',
    'NEXT_PUBLIC_ADMIN_PASSWORD',
    'VITE_ADMIN_PASSWORD'
  );

  return { email, password };
}

export function areAdminCredentialsConfigured(): boolean {
  const { email, password } = getAdminCredentials();
  return Boolean(email && password);
}

/**
 * Validates credentials against environment configuration only.
 * Returns false if env credentials are missing or do not match.
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  const inputEmail = cleanCredential(email).toLowerCase();
  const inputPass = cleanCredential(pass);
  if (!inputEmail || !inputPass) return false;

  const creds = getAdminCredentials();
  if (!creds.email || !creds.password) return false;

  return inputEmail === creds.email && inputPass === creds.password;
}
