import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV;

const getPath = (environment: string) => {
  environment = environment.trim();
  if (environment == 'production') return '.env';
  if (environment == 'development') return '.env.dev';
  if (environment == 'test') return '.env.test';
  throw new Error(`Environment is incorrect defined, environment: ${NODE_ENV}`)
}

const envPath = getPath(NODE_ENV);
const envFound = dotenv.config({ path: envPath });

if (!envFound || envFound.error) throw new Error(`Could not find ${envPath} file`);

export { default as Auth } from './auth';
export { default as Server } from './server';
