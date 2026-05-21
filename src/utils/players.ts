import { PlayersProps } from '@/types';

const VIDKING_PARAMS = '?color=3b82f6&autoPlay=true';

export const getMoviePlayers = (id: string | number, season?: number, episode?: number, startAt?: number): PlayersProps[] => {
  if (season && episode) {
    return [{
      title: 'VidKing',
      source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}${VIDKING_PARAMS}`,
      recommended: true, fast: true, resumable: true,
    }];
  }

  return [{
    title: 'VidKing',
    source: `https://www.vidking.net/embed/movie/${id}${VIDKING_PARAMS}`,
    recommended: true, fast: true, resumable: true,
  }];
};

export const getTvShowPlayers = (id: string | number, season: number, episode: number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidKing',
    source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}${VIDKING_PARAMS}`,
    recommended: true, fast: true, resumable: true,
  },
];
