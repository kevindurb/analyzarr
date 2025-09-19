import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { Icon } from '../views/elements/Icon';
import { Layout } from '../views/layouts/Layout';

export const librariesRouter = new Hono<AppEnv>();

librariesRouter.get('/', async (c) => {
  const libraries = await prisma.library.findMany();

  return c.html(
    <Layout c={c}>
      <div class='is-flex is-justify-content-space-between is-align-items-center'>
        <h1 class='title'>Matching</h1>
        <a class='button is-primary' href='/libraries/new'>
          <Icon name='add' />
        </a>
      </div>
      {libraries.map((library) => (
        <div class='card'>
          <header class='card-header'>
            <p class='card-header-title'>{library.path}</p>
            <button type='submit' class='card-header-icon'>
              <span class='icon'>
                <Icon name='trash' />
              </span>
            </button>
          </header>
        </div>
      ))}
    </Layout>,
  );
});
