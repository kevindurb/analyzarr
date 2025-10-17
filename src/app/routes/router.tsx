import byteSize from 'byte-size';
import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { Layout } from '../views/layouts/Layout';
import { filesRouter } from './files';
import { librariesRouter } from './libraries';

export const router = new Hono<AppEnv>();

router.get('/', async (c) => {
  const libraries = await prisma.library.findMany();
  const usageByType = await prisma.file.groupBy({
    by: ['fileType'],
    _sum: {
      fileSize: true,
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });
  const usageByLibrary = await prisma.file.groupBy({
    by: ['libraryId'],
    _sum: {
      fileSize: true,
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });
  const usageByVideoCodec = await prisma.file.groupBy({
    by: ['videoCodec'],
    _sum: {
      fileSize: true,
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Dashboard</h1>
      <h2 class='is-size-3'>By Library</h2>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th>Library</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByLibrary.map(({ libraryId, _sum: { fileSize } }) => {
            const library = libraries.find(({ id }) => libraryId === id);
            return (
              <tr>
                <td>
                  <a href={`/files?libraryId=${library?.id}`}>{library?.name}</a>
                </td>
                <td>{byteSize(Number(fileSize)).toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2 class='is-size-3'>By Video Codec</h2>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th>Codec</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByVideoCodec.map(({ videoCodec, _sum: { fileSize } }) => (
            <tr>
              <td>
                <a href={`/files?videoCodec=${videoCodec}`}>{videoCodec ?? 'Unknown'}</a>
              </td>
              <td>{byteSize(Number(fileSize)).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 class='is-size-3'>By Type</h2>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th>Type</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByType.map(({ fileType, _sum: { fileSize } }) => (
            <tr>
              <td>
                <a href={`/files?fileType=${fileType}`}>{fileType}</a>
              </td>
              <td>{byteSize(Number(fileSize)).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>,
  );
});

router.route('/libraries', librariesRouter);
router.route('/files', filesRouter);
