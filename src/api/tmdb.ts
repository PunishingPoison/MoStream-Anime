const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'd447ca2c61528a2f729802f7e8f2b028';
const BASE = 'https://api.themoviedb.org/3';

async function fetchApi(path: string, params: Record<string, string> = {}): Promise<any> {
  const q = new URLSearchParams({ api_key: API_KEY, language: 'en-US', ...params });
  const r = await fetch(`${BASE}${path}?${q}`);
  if (!r.ok) throw new Error('TMDB API error');
  return r.json();
}

export const tmdb = {
  trending: {
    trending: (media: 'movie' | 'tv' | 'all', time: 'day' | 'week') =>
      fetchApi(`/trending/${media}/${time}`),
  },
  movies: {
    details: (id: number, append?: string[]) =>
      fetchApi(`/movie/${id}`, append ? { append_to_response: append.join(',') } : {}),
    popular: (page = 1) => fetchApi('/movie/popular', { page: String(page) }),
    nowPlaying: (page = 1) => fetchApi('/movie/now_playing', { page: String(page) }),
    upcoming: (page = 1) => fetchApi('/movie/upcoming', { page: String(page) }),
    topRated: (page = 1) => fetchApi('/movie/top_rated', { page: String(page) }),
  },
  tvShows: {
    details: (id: number, append?: string[]) =>
      fetchApi(`/tv/${id}`, append ? { append_to_response: append.join(',') } : {}),
    popular: (page = 1) => fetchApi('/tv/popular', { page: String(page) }),
    onTheAir: (page = 1) => fetchApi('/tv/on_the_air', { page: String(page) }),
    airingToday: (page = 1) => fetchApi('/tv/airing_today', { page: String(page) }),
    topRated: (page = 1) => fetchApi('/tv/top_rated', { page: String(page) }),
    seasonDetails: (id: number, season: number) =>
      fetchApi(`/tv/${id}/season/${season}`),
  },
  search: {
    movies: (query: string, page = 1) =>
      fetchApi('/search/movie', { query, page: String(page) }),
    tvShows: (query: string, page = 1) =>
      fetchApi('/search/tv', { query, page: String(page) }),
    multi: (query: string, page = 1) =>
      fetchApi('/search/multi', { query, page: String(page) }),
  },
  discover: {
    movie: (params: Record<string, string>) => fetchApi('/discover/movie', params),
    tv: (params: Record<string, string>) => fetchApi('/discover/tv', params),
  },
  genres: {
    movie: () => fetchApi('/genre/movie/list'),
    tv: () => fetchApi('/genre/tv/list'),
  },
};
