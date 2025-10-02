import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './mikro-orm.config';

let orm: MikroORM | undefined;

export async function initORM() {
  if (orm) return orm;
  
  try {
    orm = await MikroORM.init(config);
    console.log('✅ Database connected successfully');
    return orm;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw new Error('Failed to connect to database. Please check your DATABASE_URL in .env file');
  }
}

export async function getORM() {
  if (!orm) {
    orm = await initORM();
  }
  return orm;
}

export async function closeORM() {
  if (orm) {
    await orm.close();
    orm = undefined;
  }
}

// Helper to get EntityManager in API routes
export async function getEM() {
  const orm = await getORM();
  return orm.em.fork();
}

// Helper for request context
export async function withRequestContext<T>(
  callback: () => Promise<T>
): Promise<T> {
  const orm = await getORM();
  return RequestContext.create(orm.em, callback);
}
