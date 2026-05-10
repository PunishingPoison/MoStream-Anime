import { SavedItem } from './index';

export type SavedMovieDetails = SavedItem;

export type DiscoverMoviesFetchQueryType =
  | 'discover'
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'nowPlaying'
  | 'upcoming'
  | 'topRated';

export type DiscoverTvsFetchQueryType =
  | 'discover'
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'onTheAir'
  | 'topRated';

export const DISCOVER_MOVIES_VALID_QUERY_TYPES: readonly DiscoverMoviesFetchQueryType[] = [
  'discover', 'todayTrending', 'thisWeekTrending', 'popular', 'nowPlaying', 'upcoming', 'topRated',
];

export const DISCOVER_TVS_VALID_QUERY_TYPES: readonly DiscoverTvsFetchQueryType[] = [
  'discover', 'todayTrending', 'thisWeekTrending', 'popular', 'onTheAir', 'topRated',
];
