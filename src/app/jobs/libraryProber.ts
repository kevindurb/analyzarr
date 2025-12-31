import { Cron } from 'croner';
import { ffprobe } from '@/infrastructure/ffprobe';
import { prisma } from '@/infrastructure/prisma';

export const run = async () => {
  const files = await prisma.file.findMany({
    where: { videoCodec: null, audioCodec: null, disableProbe: false },
    take: 100,
  });
  console.log('Starting Library Prober with files', files.length);

  const updates = [];

  for (const { id, filePath } of files) {
    try {
      const data = await ffprobe(filePath);
      if (!data) continue;
      const videoStream = data.streams?.find((stream) => stream.codec_type === 'video');
      const audioStream = data.streams?.find((stream) => stream.codec_type === 'audio');

      updates.push(
        prisma.file.update({
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
        }),
      );
    } catch (err) {
      console.error('Error probing file', filePath, err);
    }
  }

  await Promise.all(updates);

  console.log('Done scanning');
};

export const startSchedule = () => new Cron('15 * * * *', run);
