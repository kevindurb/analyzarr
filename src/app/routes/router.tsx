import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { dashboardRouter } from './dashboard';
import { filesRouter } from './files';
import { librariesRouter } from './libraries';

export const router = new Hono<AppEnv>();

router.get('/', (c) => c.redirect('/dashboards'));
router.route('/libraries', librariesRouter);
router.route('/files', filesRouter);
router.route('/dashboards', dashboardRouter);
