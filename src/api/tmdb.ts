import { anilist } from './anilist';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

let genreCache: Record<number, { id: number; name: string }> = {};

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', TMDB_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }
  return res.json();
}

async function loadGenres(): Promise<Record<number, { id: number; name: string }>> {
  if (Object.keys(genreCache).length > 0) return genreCache;
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdbFetch<{ genres: any[] }>('/genre/movie/list'),
      tmdbFetch<{ genres: any[] }>('/genre/tv/list'),
    ]);
    for (const g of [...(movieGenres.genres || []), ...(tvGenres.genres || [])]) {
      genreCache[g.id] = { id: g.id, name: g.name };
    }
  } catch {
    // ignore genre fetch errors
  }
  return genreCache;
}

function mapListItem(item: any, mediaType: 'movie' | 'tv') {
  const isMovie = mediaType === 'movie';
  return {
    ...item,
    id: item.id,
    title: isMovie ? (item.title || item.name || '') : undefined,
    name: !isMovie ? (item.name || item.title || '') : undefined,
    media_type: mediaType,
    genre_ids: item.genre_ids || [],
    genres: (item.genres || []).length > 0
      ? item.genres
      : (item.genre_ids || []).map((id: number) => genreCache[id]).filter(Boolean),
    release_date: isMovie ? (item.release_date || '') : undefined,
    first_air_date: !isMovie ? (item.first_air_date || item.release_date || '') : undefined,
    images: item.images || { backdrops: [], logos: [] },
    videos: item.videos || { results: [] },
  };
}

function pageResponse(data: any, mediaType: 'movie' | 'tv') {
  return {
    results: (data?.results || []).map((r: any) => mapListItem(r, mediaType)),
    page: data?.page || 1,
    total_pages: data?.total_pages || 1,
    total_results: data?.total_results || 0,
  };
}

async function fetchMovieOrTvDetail(id: number, append: string[] = []) {
  const appends = ['credits', 'videos', 'images', 'recommendations', 'similar']
    .filter(a => append.includes(a))
    .join(',');
  const params = appends ? `?append_to_response=${appends}` : '';
  try {
    const data = await tmdbFetch<any>(`/movie/${id}${params}`);
    const seasons = data.number_of_episodes
      ? Array.from({ length: Math.ceil(data.number_of_episodes / 12) }, (_, i) => ({
          id: i + 1,
          season_number: i + 1,
          name: `Season ${i + 1}`,
          episode_count: Math.min(12, data.number_of_episodes - i * 12),
          air_date: data.release_date || '',
          poster_path: data.poster_path || '',
        }))
      : [];
    return {
      ...data,
      title: data.title || data.name || '',
      name: undefined,
      media_type: 'movie',
      seasons,
      number_of_seasons: seasons.length || 1,
      number_of_episodes: data.number_of_episodes || (data.runtime ? 1 : 0),
      images: data.images || { backdrops: [], logos: [] },
      videos: data.videos || { results: [] },
      credits: data.credits || { cast: [] },
      recommendations: data.recommendations || { results: [] },
      similar: data.similar || { results: [] },
    };
  } catch {
    const data = await tmdbFetch<any>(`/tv/${id}${params}`);
    return {
      ...data,
      name: data.name || data.title || '',
      title: undefined,
      media_type: 'movie',
      images: data.images || { backdrops: [], logos: [] },
      videos: data.videos || { results: [] },
      credits: data.credits || { cast: [] },
      recommendations: data.recommendations || { results: [] },
      similar: data.similar || { results: [] },
    };
  }
}

export const tmdb = {
  trending: {
    trending: async (media: 'movie' | 'tv', time: 'day' | 'week') => {
      if (media === 'movie') {
        await loadGenres();
        const data = await tmdbFetch<any>(`/trending/tv/${time}`);
        return pageResponse(data, 'movie');
      }
      return anilist.trending.trending(media, time);
    },
  },
  movies: {
    details: async (id: number, append?: string[]) => fetchMovieOrTvDetail(id, append),
    popular: async (page = 1) => {
      await loadGenres();
      const data = await tmdbFetch<any>('/tv/popular', { page: String(page) });
      return pageResponse(data, 'movie');
    },
    nowPlaying: async (page = 1) => {
      await loadGenres();
      const data = await tmdbFetch<any>('/tv/on_the_air', { page: String(page) });
      return pageResponse(data, 'movie');
    },
    upcoming: async (page = 1) => {
      await loadGenres();
      const data = await tmdbFetch<any>('/tv/airing_today', { page: String(page) });
      return pageResponse(data, 'movie');
    },
    topRated: async (page = 1) => {
      await loadGenres();
      const data = await tmdbFetch<any>('/tv/top_rated', { page: String(page) });
      return pageResponse(data, 'movie');
    },
    seasonDetails: async (id: number, season: number) => {
      try {
        const tvData = await tmdbFetch<any>(`/tv/${id}/season/${season}`);
        return {
          episodes: (tvData.episodes || []).map((ep: any) => ({
            id: ep.id,
            name: ep.name || `Episode ${ep.episode_number}`,
            episode_number: ep.episode_number,
            season_number: ep.season_number,
            still_path: ep.still_path || tvData.poster_path || '',
            overview: ep.overview || '',
            air_date: ep.air_date || '',
          })),
        };
      } catch {
        const data = await fetchMovieOrTvDetail(id);
        const epsPerSeason = 12;
        const totalEps = data.number_of_episodes || 12;
        const startEp = (season - 1) * epsPerSeason + 1;
        const endEp = Math.min(season * epsPerSeason, totalEps);
        const episodes = [];
        for (let ep = startEp; ep <= endEp; ep++) {
          episodes.push({
            id: ep,
            name: `Episode ${ep}`,
            episode_number: ep,
            season_number: season,
            still_path: data.backdrop_path || data.poster_path || '',
            overview: `Episode ${ep} of ${data.title || data.name || ''}`,
            air_date: '',
          });
        }
        return { episodes };
      }
    },
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
    movies: async (query: string, page = 1) => {
      await loadGenres();
      const data = await tmdbFetch<any>('/search/multi', { query, page: String(page) });
      const filtered = {
        ...data,
        results: (data.results || []).filter(
          (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
        ),
      };
      return pageResponse(filtered, 'movie');
    },
    tvShows: (query: string, page = 1) => anilist.search.manga(query, page),
    multi: async (query: string, page = 1) => {
      const [anime, manga] = await Promise.all([
        tmdb.search.movies(query, page),
        anilist.search.manga(query, page),
      ]);
      return {
        results: [...anime.results, ...manga.results],
        page,
        total_pages: 1,
        total_results: anime.results.length + manga.results.length,
      };
    },
  },
  discover: {
    movie: async (params: Record<string, string>) => {
      await loadGenres();
      const sortMap: Record<string, string> = {
        popularity: 'popularity.desc',
        vote_average: 'vote_average.desc',
        primary_release_date: 'primary_release_date.desc',
      };
      const sortBy = sortMap[params.sort_by] || 'popularity.desc';
      const queryParams: Record<string, string> = {
        sort_by: sortBy,
        page: params.page || '1',
        with_genres: params.with_genres || '',
        'vote_count.gte': '50',
      };
      Object.keys(queryParams).forEach(k => { if (!queryParams[k]) delete queryParams[k]; });
      const data = await tmdbFetch<any>('/discover/tv', queryParams);
      return pageResponse(data, 'movie');
    },
    tv: (params: Record<string, string>) => anilist.discover.manga(params),
  },
  genres: {
    movie: async () => {
      const genres = await loadGenres();
      return { genres: Object.values(genres).filter(g => g.name) };
    },
    tv: () => anilist.genres.manga(),
  },
};
