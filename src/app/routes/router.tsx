import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { Layout } from '../views/layouts/Layout';
import { IndexPage } from '../views/pages/IndexPage';
import { librariesRouter } from './libraries';

export const router = new Hono<AppEnv>();

router.get('/', (c) =>
  c.html(
    <Layout c={c}>
      <IndexPage />
    </Layout>,
  ),
);

router.route('/libraries', librariesRouter);
