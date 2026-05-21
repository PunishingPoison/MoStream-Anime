import { SavedItem } from './index';

export type SavedAnimeDetails = SavedItem;

export type DiscoverAnimeFetchQueryType =
  | 'discover'
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'nowPlaying'
  | 'upcoming'
  | 'topRated';

export type DiscoverMangaFetchQueryType =
  | 'discover'
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'onTheAir'
  | 'topRated';

export const DISCOVER_MOVIES_VALID_QUERY_TYPES: readonly DiscoverAnimeFetchQueryType[] = [
  'discover', 'todayTrending', 'thisWeekTrending', 'popular', 'nowPlaying', 'upcoming', 'topRated',
];

export const DISCOVER_TVS_VALID_QUERY_TYPES: readonly DiscoverMangaFetchQueryType[] = [
  'discover', 'todayTrending', 'thisWeekTrending', 'popular', 'onTheAir', 'topRated',
];
