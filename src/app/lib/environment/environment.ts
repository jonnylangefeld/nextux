/**
 * Require an environment variable to be set.
 * @param name The name of the environment variable
 * @returns The value of the environment variable
 */
export function requireEnvVariable(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

export const env = {
  GOOGLE_APPLICATION_CREDENTIALS_JSON: requireEnvVariable("GOOGLE_APPLICATION_CREDENTIALS_JSON"),
  // GCS_BUCKET: requireEnvVariable("GCS_BUCKET"),
  OPENAI_API_KEY: requireEnvVariable("OPENAI_API_KEY"),
  // NEXT_PUBLIC_SUPABASE_URL: requireEnvVariable("NEXT_PUBLIC_SUPABASE_URL"),
  // SUPABASE_SERVICE_ROLE_KEY: requireEnvVariable("SUPABASE_SERVICE_ROLE_KEY"),
}
