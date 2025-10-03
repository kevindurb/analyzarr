import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { scanLibrary } from '@/domain/libraryScanner';
import { LibraryType } from '@/generated/prisma';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { CreateLibraryBody } from '../validators/CreateLibrary';
import { Fab } from '../views/elements/Fab';
import { Icon } from '../views/elements/Icon';
import { Layout } from '../views/layouts/Layout';

export const librariesRouter = new Hono<AppEnv>();

librariesRouter.get('/', async (c) => {
  const libraries = await prisma.library.findMany({
    include: {
      _count: {
        select: { files: true },
      },
    },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Libraries</h1>
      {libraries.map((library) => (
        <div class='card'>
          <header class='card-header'>
            <p class='card-header-title'>
              {`${library.name}:`}
              <i class='is-italic has-text-weight-light'>{library.path}</i>
              {library._count.files ? (
                <span class='tag'>{library._count.files}</span>
              ) : (
                <span class='tag is-danger'>No Files Found</span>
              )}
            </p>
            <form method='post' action={`/libraries/${library.id}/delete`}>
              <button type='submit' class='card-header-icon is-danger'>
                <span class='icon'>
                  <Icon name='delete' />
                </span>
              </button>
            </form>
            <form method='post' action={`/libraries/${library.id}/scan`}>
              <button type='submit' class='card-header-icon'>
                <span class='icon'>
                  <Icon name='scan' />
                </span>
              </button>
            </form>
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
                <option value={CreateLibraryBody.shape.type.encode(LibraryType.Movies)}>
                  Movies
                </option>
                <option value={CreateLibraryBody.shape.type.encode(LibraryType.TvShows)}>
                  TV Shows
                </option>
                <option value={CreateLibraryBody.shape.type.encode(LibraryType.Music)}>
                  Music
                </option>
                <option value={CreateLibraryBody.shape.type.encode(LibraryType.Other)}>
                  Other
                </option>
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

librariesRouter.post('/new', zValidator('form', CreateLibraryBody), async (c) => {
  await prisma.library.create({
    data: c.req.valid('form'),
  });
  c.get('session').flash('success', 'Library created');
  return c.redirect('/libraries');
});

librariesRouter.post('/:libraryId/scan', async (c) => {
  const library = await prisma.library.findUniqueOrThrow({
    where: { id: c.req.param('libraryId') },
  });
  await scanLibrary(library);
  c.get('session').flash('success', 'Library scanned');
  return c.redirect('/libraries');
});

librariesRouter.post('/:libraryId/delete', async (c) => {
  await prisma.library.delete({
    where: { id: c.req.param('libraryId') },
  });
  c.get('session').flash('success', 'Library deleted');
  return c.redirect('/libraries');
});
