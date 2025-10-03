import { zValidator } from '@hono/zod-validator';
import byteSize from 'byte-size';
import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { ListFilesQuery } from '../validators/ListFiles';
import { Layout } from '../views/layouts/Layout';

export const filesRouter = new Hono<AppEnv>();

filesRouter.get('/', zValidator('query', ListFilesQuery), async (c) => {
  const files = await prisma.file.findMany({
    where: c.req.valid('query'),
    orderBy: { fileSize: 'desc' },
  });
  return c.html(
    <Layout c={c}>
      <h1 class='title'>Files</h1>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th>Path</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr>
              <td>{file.filePath}</td>
              <td>{byteSize(Number(file.fileSize)).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>,
  );
});
