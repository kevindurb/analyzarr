import byteSize from 'byte-size';
import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { GroupedStats } from '../views/components/GroupedStats';
import { Layout } from '../views/layouts/Layout';

export const dashboardRouter = new Hono<AppEnv>();

const MIN_SIZE = 1e6; // 1MB

dashboardRouter.get('/', async (c) => {
  const libraries = await prisma.library.findMany();
  const usageByType = await prisma.file.groupBy({
    by: ['fileType'],
    _sum: {
      fileSize: true,
    },
    where: {
      fileSize: { gte: MIN_SIZE },
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
    where: {
      fileSize: { gte: MIN_SIZE },
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
    where: {
      videoCodec: { not: null },
      fileSize: { gte: MIN_SIZE },
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });
  const totals = await prisma.file.aggregate({
    _sum: { fileSize: true },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Dashboard</h1>
      <h2 class='title is-size-4 has-text-primary'>
        Total Size: {byteSize(Number(totals._sum.fileSize)).toString()}
      </h2>
      <div class='columns'>
        <div class='column'>
          <GroupedStats
            heading={<a href='/dashboards/libraries'>By Library</a>}
            columns={['Library', 'Size']}
            data={usageByLibrary.map(({ libraryId: key, _sum: { fileSize: value } }) => ({
              key,
              value,
            }))}
            renderKey={({ item: { key: libraryId } }) => {
              const library = libraries.find(({ id }) => libraryId === id);
              return <a href={`/files?libraryId=${library?.id}`}>{library?.name}</a>;
            }}
          />
        </div>
        <div class='column'>
          <GroupedStats
            heading={<a href='/dashboards/video_codecs'>By Video Codec</a>}
            columns={['Codec', 'Size']}
            data={usageByVideoCodec.map(({ videoCodec: key, _sum: { fileSize: value } }) => ({
              key,
              value,
            }))}
            renderKey={({ item: { key: videoCodec } }) => {
              return <a href={`/files?videoCodec=${videoCodec}`}>{videoCodec}</a>;
            }}
          />
        </div>
        <div class='column'>
          <GroupedStats
            heading={<a href='/dashboards/types'>By Type</a>}
            columns={['Type', 'Size']}
            data={usageByType.map(({ fileType: key, _sum: { fileSize: value } }) => ({
              key,
              value,
            }))}
            renderKey={({ item: { key: fileType } }) => {
              return <a href={`/files?fileType=${fileType}`}>{fileType}</a>;
            }}
          />
        </div>
      </div>
    </Layout>,
  );
});

dashboardRouter.get('/libraries', async (c) => {
  const libraries = await prisma.library.findMany();
  const usageByLibrary = await prisma.file.groupBy({
    by: ['libraryId'],
    _sum: {
      fileSize: true,
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Libraries</h1>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th scope='col'>Library</th>
            <th scope='col'>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByLibrary.map(({ libraryId, _sum: { fileSize } }) => {
            const library = libraries.find(({ id }) => libraryId === id);
            return (
              <tr>
                <th scope='row'>
                  <a href={`/files?libraryId=${library?.id}`}>{library?.name}</a>
                </th>
                <td>{byteSize(Number(fileSize)).toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>,
  );
});

dashboardRouter.get('/video_codecs', async (c) => {
  const usageByVideoCodec = await prisma.file.groupBy({
    by: ['videoCodec'],
    _sum: {
      fileSize: true,
    },
    where: {
      videoCodec: { not: null },
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Video Codecs</h1>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th scope='col'>Codec</th>
            <th scope='col'>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByVideoCodec.map(({ videoCodec, _sum: { fileSize } }) => {
            return (
              <tr>
                <th scope='row'>
                  <a href={`/files?videoCodec=${videoCodec}`}>{videoCodec}</a>
                </th>
                <td>{byteSize(Number(fileSize)).toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>,
  );
});

dashboardRouter.get('/types', async (c) => {
  const usageByType = await prisma.file.groupBy({
    by: ['fileType'],
    _sum: {
      fileSize: true,
    },
    orderBy: {
      _sum: { fileSize: 'desc' },
    },
  });

  return c.html(
    <Layout c={c}>
      <h1 class='title'>Types</h1>
      <table class='table is-fullwidth'>
        <thead>
          <tr>
            <th scope='col'>Type</th>
            <th scope='col'>Size</th>
          </tr>
        </thead>
        <tbody>
          {usageByType.map(({ fileType, _sum: { fileSize } }) => {
            return (
              <tr>
                <th scope='row'>
                  <a href={`/files?fileType=${fileType}`}>{fileType}</a>
                </th>
                <td>{byteSize(Number(fileSize)).toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>,
  );
});
