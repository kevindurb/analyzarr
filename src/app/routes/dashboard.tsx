import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { GroupedStatsPie } from '../views/components/GroupedStatsPie';
import { Layout } from '../views/layouts/Layout';

export const dashboardRouter = new Hono<AppEnv>();

dashboardRouter.get('/', async (c) => {
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
      <div class='columns'>
        <div class='column'>
          <GroupedStatsPie
            heading='By Library'
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
          <GroupedStatsPie
            heading='By Video Codec'
            columns={['Codec', 'Size']}
            data={usageByVideoCodec.map(({ videoCodec: key, _sum: { fileSize: value } }) => ({
              key,
              value,
            }))}
            renderKey={({ item: { key: videoCodec } }) => {
              return <a href={`/files?videoCodec=${videoCodec}`}>{videoCodec ?? 'Unknown'}</a>;
            }}
          />
        </div>
        <div class='column'>
          <GroupedStatsPie
            heading='By Type'
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
