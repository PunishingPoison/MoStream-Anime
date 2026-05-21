const ANILIST_API = 'https://graphql.anilist.co';

type MediaType = 'ANIME' | 'MANGA';

async function graphql<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'AniList API error');
  }
  return json.data;
}

const GENRE_HASH: Record<string, number> = {};
let genreCounter = 1;
function genreId(name: string): number {
  if (!GENRE_HASH[name]) GENRE_HASH[name] = genreCounter++;
  return GENRE_HASH[name];
}

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
}

function dateStr(d: { year?: number | null; month?: number | null; day?: number | null }): string {
  if (!d?.year) return '';
  const m = String(d.month ?? 1).padStart(2, '0');
  const day = String(d.day ?? 1).padStart(2, '0');
  return `${d.year}-${m}-${day}`;
}

function mapMedia(m: any, type: 'movie' | 'tv' = 'movie') {
  const title = m.title?.userPreferred || m.title?.romaji || m.title?.english || '';
  const poster = m.coverImage?.extraLarge || m.coverImage?.large || '';
  const backdrop = m.bannerImage || '';
  return {
    id: m.id,
    title: type === 'movie' ? title : undefined,
    name: type === 'tv' ? title : undefined,
    original_title: m.title?.native || '',
    overview: stripHtml(m.description),
    poster_path: poster,
    backdrop_path: backdrop,
    release_date: type === 'movie' ? dateStr(m.startDate) : undefined,
    first_air_date: type === 'tv' ? dateStr(m.startDate) : undefined,
    vote_average: (m.averageScore || 0) / 10,
    vote_count: m.meanScore || 0,
    adult: m.isAdult || false,
    genres: (m.genres || []).map((g: string) => ({ id: genreId(g), name: g })),
    runtime: m.duration || 0,
    episodes: m.episodes || 0,
    number_of_episodes: m.episodes || 0,
    number_of_seasons: m.seasons || 1,
    popularity: m.popularity || 0,
    media_type: type,
    status: m.status || '',
    original_language: m.source || '',
    origin_country: m.countryOfOrigin ? [m.countryOfOrigin] : [],
    images: {
      logos: [] as { file_path: string; iso_639_1?: string }[],
      backdrops: m.bannerImage ? [{ file_path: m.bannerImage }] : ([] as { file_path: string }[]),
    },
    videos: {
      results: m.trailer?.id ? [{ key: m.trailer.id, name: 'Trailer', site: m.trailer.site || 'youtube', type: 'Trailer', official: true }] : [],
    },
  };
}

function mapCharacter(edge: any) {
  return {
    id: edge.node?.id || 0,
    name: edge.node?.name?.full || '',
    character: edge.node?.name?.full || '',
    profile_path: edge.node?.image?.large || '',
    known_for_department: edge.role || 'CAST',
  };
}

const MEDIA_FIELDS = `
  id
  title { romaji english userPreferred native }
  coverImage { large extraLarge }
  bannerImage
  startDate { year month day }
  endDate { year month day }
  averageScore
  meanScore
  description
  genres
  episodes
  duration
  chapters
  volumes
  format
  status
  isAdult
  season
  seasonYear
  popularity
  countryOfOrigin
  source
  trailer { id site thumbnail }
  nextAiringEpisode { airingAt timeUntilAiring episode }
  studios { nodes { name } }
`;

const PAGE_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(sort: TRENDING_DESC, type: $type, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const POPULAR_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(sort: POPULARITY_DESC, type: $type, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const TOP_RATED_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(sort: SCORE_DESC, type: $type, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const DETAIL_QUERY = `
  query ($id: Int, $type: MediaType) {
    Media(id: $id, type: $type) {
      ${MEDIA_FIELDS}
      characters(sort: ROLE, perPage: 12) {
        edges {
          node { id name { full } image { large } }
          role
        }
      }
      recommendations(sort: RATING_DESC, perPage: 20) {
        edges {
          node {
            mediaRecommendation {
              id
              title { romaji english userPreferred }
              coverImage { large extraLarge }
              bannerImage
              averageScore
              description
              genres
              episodes
              duration
              format
              isAdult
              startDate { year month day }
              season
            }
          }
        }
      }
      relations {
        edges {
          node {
            id
            title { romaji english userPreferred }
            coverImage { large extraLarge }
            bannerImage
            averageScore
            description
            genres
            episodes
            duration
            format
            isAdult
            startDate { year month day }
            season
          }
          relationType
        }
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(search: $search, type: $type, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const DISCOVER_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType, $genre: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(genre: $genre, type: $type, sort: $sort, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const GENRES_QUERY = `
  query ($type: MediaType) {
    GenreCollection
  }
`;

function pageResult(data: any, type: 'movie' | 'tv') {
  const page = data?.Page;
  const results = (page?.media || []).map((m: any) => mapMedia(m, type));
  return {
    results,
    page: page?.pageInfo?.currentPage || 1,
    total_pages: page?.pageInfo?.lastPage || 1,
    total_results: page?.pageInfo?.total || results.length,
  };
}

export const anilist = {
  trending: {
    trending: async (media: 'movie' | 'tv', time: 'day' | 'week') => {
      const type: MediaType = media === 'movie' ? 'ANIME' : 'MANGA';
      const data = await graphql<any>(PAGE_QUERY, { page: 1, perPage: 20, type });
      return pageResult(data, media);
    },
  },
  anime: {
    details: async (id: number, append?: string[]) => {
      const data = await graphql<any>(DETAIL_QUERY, { id, type: 'ANIME' });
      const m = data?.Media;
      if (!m) return null;
      const epsPerSeason = 12;
      const totalEpisodes = m.episodes || 12;
      const totalSeasons = Math.ceil(totalEpisodes / epsPerSeason);
      const mapped = {
        ...mapMedia(m, 'movie'),
        credits: {
          cast: (m.characters?.edges || []).map(mapCharacter),
        },
        recommendations: {
          results: (m.recommendations?.edges || []).map((e: any) => ({
            ...mapMedia(e.node?.mediaRecommendation, 'movie'),
          })),
        },
        similar: {
          results: (m.relations?.edges || [])
            .filter((e: any) => e.relationType === 'SEQUEL' || e.relationType === 'SIDE_STORY')
            .map((e: any) => ({
              ...mapMedia(e.node, 'movie'),
            })),
        },
        seasons: Array.from({ length: totalSeasons }, (_, i) => ({
          id: i + 1,
          season_number: i + 1,
          name: `Season ${i + 1}`,
          episode_count: Math.min(epsPerSeason, totalEpisodes - i * epsPerSeason),
          air_date: m.startDate?.year ? `${m.startDate.year}-01-01` : '',
          poster_path: m.coverImage?.large || '',
        })),
        number_of_seasons: totalSeasons,
        number_of_episodes: totalEpisodes,
      };
      return mapped;
    },
    popular: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'ANIME' });
      return pageResult(data, 'movie');
    },
    nowPlaying: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'ANIME' });
      return pageResult(data, 'movie');
    },
    upcoming: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'ANIME' });
      return pageResult(data, 'movie');
    },
    topRated: async (page = 1) => {
      const data = await graphql<any>(TOP_RATED_QUERY, { page, perPage: 20, type: 'ANIME' });
      return pageResult(data, 'movie');
    },
    seasonDetails: async (id: number, season: number) => {
      const data = await graphql<any>(DETAIL_QUERY, { id, type: 'ANIME' });
      const m = data?.Media;
      const epsPerSeason = 12;
      const totalEpisodes = m?.episodes || 12;
      const startEp = (season - 1) * epsPerSeason + 1;
      const endEp = Math.min(season * epsPerSeason, totalEpisodes);
      const episodes = [];
      for (let ep = startEp; ep <= endEp; ep++) {
        episodes.push({
          id: ep,
          name: `Episode ${ep}`,
          episode_number: ep,
          season_number: season,
          still_path: m?.bannerImage || m?.coverImage?.large || '',
          overview: `Episode ${ep} of ${m?.title?.romaji || ''}`,
          air_date: '',
        });
      }
      return { episodes };
    },
  },
  manga: {
    details: async (id: number, append?: string[]) => {
      const data = await graphql<any>(DETAIL_QUERY, { id, type: 'MANGA' });
      const m = data?.Media;
      if (!m) return null;
      const mapped = {
        ...mapMedia(m, 'tv'),
        credits: {
          cast: (m.characters?.edges || []).map(mapCharacter),
        },
        recommendations: {
          results: (m.recommendations?.edges || []).map((e: any) => ({
            ...mapMedia(e.node?.mediaRecommendation, 'tv'),
          })),
        },
        similar: {
          results: (m.relations?.edges || [])
            .filter((e: any) => e.relationType === 'SEQUEL' || e.relationType === 'SIDE_STORY')
            .map((e: any) => ({
              ...mapMedia(e.node, 'tv'),
            })),
        },
        seasons: m.volumes
          ? Array.from({ length: Math.min(m.volumes, 12) }, (_, i) => ({
              id: i + 1,
              season_number: i + 1,
              name: `Volume ${i + 1}`,
              episode_count: Math.ceil((m.chapters || m.episodes || 100) / Math.min(m.volumes, 12)),
              air_date: m.startDate?.year ? `${m.startDate.year}-01-01` : '',
              poster_path: m.coverImage?.large || '',
            }))
          : [],
        number_of_seasons: m.volumes || 1,
        number_of_episodes: m.chapters || m.episodes || 0,
      };
      return mapped;
    },
    popular: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'MANGA' });
      return pageResult(data, 'tv');
    },
    onTheAir: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'MANGA' });
      return pageResult(data, 'tv');
    },
    airingToday: async (page = 1) => {
      const data = await graphql<any>(POPULAR_QUERY, { page, perPage: 20, type: 'MANGA' });
      return pageResult(data, 'tv');
    },
    topRated: async (page = 1) => {
      const data = await graphql<any>(TOP_RATED_QUERY, { page, perPage: 20, type: 'MANGA' });
      return pageResult(data, 'tv');
    },
    seasonDetails: async (id: number, season: number) => {
      const data = await graphql<any>(DETAIL_QUERY, { id, type: 'MANGA' });
      const m = data?.Media;
      const chPerVol = Math.ceil((m?.chapters || m?.episodes || 100) / Math.max(m?.volumes || 1, 1));
      const startEp = (season - 1) * chPerVol + 1;
      const endEp = Math.min(season * chPerVol, m?.chapters || m?.episodes || 100);
      const episodes = [];
      for (let ep = startEp; ep <= endEp; ep++) {
        episodes.push({
          id: ep,
          name: `Chapter ${ep}`,
          episode_number: ep,
          season_number: season,
          still_path: m?.coverImage?.large || '',
          overview: `Chapter ${ep} of ${m?.title?.romaji || ''}`,
          air_date: m?.startDate?.year ? `${m.startDate.year}-01-01` : '',
        });
      }
      return { episodes };
    },
  },
  search: {
    anime: async (query: string, page = 1) => {
      const data = await graphql<any>(SEARCH_QUERY, { search: query, page, perPage: 20, type: 'ANIME' });
      return pageResult(data, 'movie');
    },
    manga: async (query: string, page = 1) => {
      const data = await graphql<any>(SEARCH_QUERY, { search: query, page, perPage: 20, type: 'MANGA' });
      return pageResult(data, 'tv');
    },
    multi: async (query: string, page = 1) => {
      const [anime, manga] = await Promise.all([
        anilist.search.anime(query, page),
        anilist.search.manga(query, page),
      ]);
      return { results: [...anime.results, ...manga.results], page, total_pages: 1, total_results: anime.results.length + manga.results.length };
    },
  },
  discover: {
    anime: async (params: Record<string, string>) => {
      const sort: string[] = [];
      const genre = params.with_genres || '';
      if (params.sort_by?.includes('popularity')) sort.push('POPULARITY_DESC');
      else if (params.sort_by?.includes('vote_average')) sort.push('SCORE_DESC');
      else sort.push('POPULARITY_DESC');
      const page = parseInt(params.page || '1');
      const data = await graphql<any>(DISCOVER_QUERY, { page, perPage: 20, type: 'ANIME', genre: genre || undefined, sort });
      return pageResult(data, 'movie');
    },
    manga: async (params: Record<string, string>) => {
      const sort: string[] = [];
      const genre = params.with_genres || '';
      if (params.sort_by?.includes('popularity')) sort.push('POPULARITY_DESC');
      else if (params.sort_by?.includes('vote_average')) sort.push('SCORE_DESC');
      else sort.push('POPULARITY_DESC');
      const page = parseInt(params.page || '1');
      const data = await graphql<any>(DISCOVER_QUERY, { page, perPage: 20, type: 'MANGA', genre: genre || undefined, sort });
      return pageResult(data, 'tv');
    },
  },
  genres: {
    anime: async () => {
      const data = await graphql<any>(GENRES_QUERY, { type: 'ANIME' });
      return { genres: (data?.GenreCollection || []).map((g: string) => ({ id: genreId(g), name: g })) };
    },
    manga: async () => {
      const data = await graphql<any>(GENRES_QUERY, { type: 'MANGA' });
      return { genres: (data?.GenreCollection || []).map((g: string) => ({ id: genreId(g), name: g })) };
    },
  },
};
