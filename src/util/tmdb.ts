type TvSeriesLike = { name?: string };
type MovieLike = { title?: string };

export const isTvSeries = (item: TvSeriesLike | MovieLike): item is TvSeriesLike => 'name' in item;
