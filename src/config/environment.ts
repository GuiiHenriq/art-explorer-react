/**
 * Environment configuration for the Art Explorer application
 * Handles environment variables with proper fallbacks and type safety
 */

interface Config {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set, using default: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

export const config: Config = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3003/api'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
