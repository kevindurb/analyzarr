import { Hono } from 'hono';
import { IndexPage } from '../views/pages/IndexPage';

export const router = new Hono();

router.get('/', (c) => c.html(<IndexPage />));
