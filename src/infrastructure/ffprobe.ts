import { $ } from 'bun';
import z from 'zod';

export const FFProbeSubtitleStream = z.object({
  index: z.number(),
  codec_type: z.literal('subtitle'),
});

export const FFProbeVideoStream = z.object({
  codec_name: z.string().optional(),
  codec_type: z.literal('video'),
  width: z.int().optional(),
  height: z.int().optional(),
});

export const FFProbeAudioStream = z.object({
  codec_name: z.string().optional(),
  codec_type: z.literal('audio'),
});

export const FFProbeDataStream = z.object({
  codec_type: z.literal('data'),
});

export const FFProbeFormat = z.object({});

export const FFProbeOutput = z.object({
  streams: z
    .array(
      z.union([FFProbeVideoStream, FFProbeAudioStream, FFProbeDataStream, FFProbeSubtitleStream]),
    )
    .optional(),
  format: FFProbeFormat.optional(),
});

export const ffprobe = async (path: string): Promise<z.infer<typeof FFProbeOutput> | undefined> => {
  try {
    const result =
      await $`ffprobe -v quiet -print_format json -show_format -show_streams ${path}`.json();
    console.log('Probed file', path);
    return await FFProbeOutput.parseAsync(result);
  } catch (err) {
    console.error('Error probing file', err);
  }
};
