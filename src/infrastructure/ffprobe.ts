import { $ } from 'bun';
import z from 'zod';
import { stringToFloat, stringToInt } from '@/util/zod';

export const FFProbeEmptyStream = z.object({
  codec_type: z.literal('').optional(),
});

export const FFProbeSubtitleStream = z.object({
  index: z.number(),
  codec_type: z.literal('subtitle'),
});

export const FFProbeVideoStream = z.object({
  index: z.number(),
  codec_name: z.string(),
  codec_type: z.literal('video'),
  width: z.int(),
  height: z.int(),
  duration: stringToFloat.optional(),
  bit_rate: stringToInt.optional(),
});

export const FFProbeAudioStream = z.object({
  index: z.number(),
  codec_name: z.string(),
  codec_type: z.literal('audio'),
  duration: stringToFloat,
  bit_rate: stringToInt,
  channels: z.number(),
});

export const FFProbeDataStream = z.object({
  index: z.number(),
  codec_type: z.literal('data'),
  duration: stringToFloat,
});

export const FFProbeFormat = z.object({
  filename: z.string(),
  format_name: z.string(),
  format_long_name: z.string(),
  duration: stringToFloat.optional(),
  size: stringToInt,
  bit_rate: stringToInt.optional(),
});

export const FFProbeOutput = z.object({
  streams: z
    .array(
      z.union([
        FFProbeVideoStream,
        FFProbeAudioStream,
        FFProbeDataStream,
        FFProbeSubtitleStream,
        FFProbeEmptyStream,
      ]),
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
