import byteSize from 'byte-size';
import { Hono } from 'hono';
import { prisma } from '@/infrastructure/prisma';
import type { AppEnv } from '../types';
import { GroupedStats } from '../views/components/GroupedStats';
import { Icon } from '../views/elements/Icon';
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
    where: {
      videoCodec: { not: null },
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
          <GroupedStats
            heading='By Video Codec'
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
