export type ContentType = 'movie' | 'tv';

export type Params<T> = {
  params: Promise<T>;
};

export type ActionResponse<T = null> = Promise<{
  success: boolean;
  message?: string;
  data?: T;
}>;

export type MovieParam =
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'nowPlaying'
  | 'upcoming'
  | 'topRated';

export type TvShowParam =
  | 'todayTrending'
  | 'thisWeekTrending'
  | 'popular'
  | 'onTheAir'
  | 'topRated';

export type QueryList<T> = {
  name: string;
  query: () => Promise<any>;
  param: string;
};

export type SiteConfigType = {
  name: string;
  description: string;
  favicon: string;
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[];
  queryLists: {
    movies: QueryList<any>[];
    tvShows: QueryList<any>[];
  };
  themes: {
    name: 'light' | 'dark' | 'system';
    icon: React.ReactNode;
  }[];
  socials: {
    github: string;
  };
};

export type PlayersProps = {
  title: string;
  source: `https://${string}`;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
  resumable?: boolean;
};

export type SavedItem = {
  type: ContentType;
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  vote_average: number;
  saved_date: string;
};
