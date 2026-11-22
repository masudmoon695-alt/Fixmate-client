import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017');
const db = client.db(process.env.DB_NAME || 'fixmateDB');

const adapter = mongodbAdapter(db, { client, transaction: false });

const TRUSTED_ORIGINS = (process.env.TRUSTED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

const isProduction = process.env.NODE_ENV === 'production';

const ALLOWED_ROLES = ['customer', 'technician'];

export const auth = betterAuth({
  user: {
    modelName: 'users',
    additionalFields: {
      role: { type: 'string', defaultValue: 'customer', input: true },
      phone: { type: 'string', required: false, input: false },
      area: { type: 'string', required: false, input: false },
      bio: { type: 'string', required: false, input: false },
    },
  },
  database: adapter,
  secret: process.env.BETTER_AUTH_SECRET || 'fixmate-dev-insecure-secret',
  baseURL: BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  useSecureCookies: isProduction,
  defaultCookieAttributes: {
    sameSite: 'none',
    secure: isProduction,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const currentRole = user?.role;
          const safeRole = ALLOWED_ROLES.includes(currentRole) ? currentRole : 'customer';
          if (!user || typeof user !== 'object') {
            return { data: { ...(user || {}), role: 'customer' } };
          }
          return { data: { ...user, role: safeRole } };
        },
      },
    },
  },
  trustedOrigins: [BETTER_AUTH_URL, API_URL, ...TRUSTED_ORIGINS].filter(Boolean),
});

export const api = auth.api;
export const handlers = auth.handler;
