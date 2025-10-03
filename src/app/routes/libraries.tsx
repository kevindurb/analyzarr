import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { Fab } from '../views/elements/Fab';
import { Icon } from '../views/elements/Icon';
import { Layout } from '../views/layouts/Layout';

export const librariesRouter = new Hono<AppEnv>();

librariesRouter.get('/', async (c) => {
  const libraries = await prisma.library.findMany();

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Libraries</h1>
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
      <Fab href='/libraries/new'>
        <Icon name='add' />
      </Fab>
    </Layout>,
  );
});

librariesRouter.get('/new', (c) => {
  return c.html(
    <Layout c={c}>
      <h1 class='title'>Add a new library</h1>
      <form method='post' action='/libraries/new'>
        <div class='field has-addons'>
          <div class='control is-expanded'>
            <input
              class='input is-fullwidth'
              type='text'
              id='name'
              name='name'
              placeholder='Name'
              required
              autofocus
            />
          </div>
          <div class='control'>
            <div class='select'>
              <select id='type' name='type' required>
                <option value='' disabled>
                  Type
                </option>
                <option value='movies'>Movies</option>
                <option value='tv_shows'>TV Shows</option>
                <option value='music'>Music</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class='field'>
          <label for='path' class='label'>
            Path
          </label>
          <div class='control'>
            <input
              class='input'
              type='text'
              id='path'
              name='path'
              placeholder='/media/Movies'
              required
            />
          </div>
        </div>
        <Fab>
          <Icon name='save' />
        </Fab>
      </form>
    </Layout>,
  );
});
