import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { csrf } from 'hono/csrf';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { CookieStore, sessionMiddleware } from 'hono-sessions';

import { prisma } from '@/infrastructure/prisma';
import { getAppSecret } from '@/util/env';
import { router } from './routes/router';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

app.use(requestId());
app.use(logger());
app.use(csrf());
app.use(etag());
app.use(secureHeaders());

app.use('/*', serveStatic({ root: './public' }));
app.use(
  sessionMiddleware({
    store: new CookieStore(),
    encryptionKey: getAppSecret(),
    cookieOptions: {
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
    },
  }),
);

app.onError((err, c) => {
  console.error(err);
  c.get('session').flash('error', `Server Error: ${err.message}`);
  const referrer = new URL(c.req.header('Referer') ?? '/');
  return c.redirect(referrer.pathname);
});

app.route('/', router);

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
