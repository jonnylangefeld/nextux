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
  OPENAI_API_KEY: requireEnvVariable("OPENAI_API_KEY"),
  PLUNK_TOKEN: requireEnvVariable("PLUNK_TOKEN"),
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
}
