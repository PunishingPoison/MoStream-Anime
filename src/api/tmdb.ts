import { anilist } from './anilist';

export const tmdb = {
  trending: {
    trending: (media: 'movie' | 'tv', time: 'day' | 'week') =>
      anilist.trending.trending(media, time),
  },
  movies: {
    details: (id: number, append?: string[]) => anilist.anime.details(id, append),
    popular: (page = 1) => anilist.anime.popular(page),
    nowPlaying: (page = 1) => anilist.anime.nowPlaying(page),
    upcoming: (page = 1) => anilist.anime.upcoming(page),
    topRated: (page = 1) => anilist.anime.topRated(page),
  },
  tvShows: {
    details: (id: number, append?: string[]) => anilist.manga.details(id, append),
    popular: (page = 1) => anilist.manga.popular(page),
    onTheAir: (page = 1) => anilist.manga.onTheAir(page),
    airingToday: (page = 1) => anilist.manga.airingToday(page),
    topRated: (page = 1) => anilist.manga.topRated(page),
    seasonDetails: (id: number, season: number) => anilist.manga.seasonDetails(id, season),
  },
  search: {
    movies: (query: string, page = 1) => anilist.search.anime(query, page),
    tvShows: (query: string, page = 1) => anilist.search.manga(query, page),
    multi: (query: string, page = 1) => anilist.search.multi(query, page),
  },
  discover: {
    movie: (params: Record<string, string>) => anilist.discover.anime(params),
    tv: (params: Record<string, string>) => anilist.discover.manga(params),
  },
  genres: {
    movie: () => anilist.genres.anime(),
    tv: () => anilist.genres.manga(),
  },
};
