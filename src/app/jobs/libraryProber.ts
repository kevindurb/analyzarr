import { Cron } from 'croner';
import type { File } from '@/generated/prisma';
import { ffprobe } from '@/infrastructure/ffprobe';
import { prisma } from '@/infrastructure/prisma';

declare var self: Worker;

export const run = async () => {
  const files = await prisma.file.findMany({
    where: { videoCodec: null, audioCodec: null, disableProbe: false },
    take: 100,
  });
  const worker = new Worker(import.meta.url);
  worker.postMessage({ files });
};

export const startSchedule = () => new Cron('15 * * * *', run);

self.onmessage = async (event: MessageEvent<{ files: File[] }>) => {
  try {
    const { files } = event.data;
    console.log(`Probing ${files.length} files`);

    for (const { id, filePath } of files) {
      try {
        const data = await ffprobe(filePath);
        if (!data) continue;
        const videoStream = data.streams?.find((stream) => stream.codec_type === 'video');
        const audioStream = data.streams?.find((stream) => stream.codec_type === 'audio');

        await prisma.file.update({
          where: {
            id,
          },
          data: {
            videoCodec: videoStream?.codec_name,
            videoHeight: videoStream?.height,
            videoWidth: videoStream?.width,
            audioCodec: audioStream?.codec_name,
            disableProbe: !data.format,
          },
        });
      } catch (err) {
        console.error('Error probing file', filePath, err);
      }
    }

    console.log('Done scanning');
  } finally {
    self.terminate();
  }
};
