import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { CookieStore, sessionMiddleware } from 'hono-sessions';
import { getAppSecret } from '@/util/env';
import { router } from './routes/router';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

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
app.route('/', router);

export default app;
