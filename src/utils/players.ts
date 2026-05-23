import { PlayersProps } from '@/types';

const VIDKING_PARAMS = '?color=3b82f6&autoPlay=true';

export const getMoviePlayers = (id: string | number, season?: number, episode?: number, startAt?: number): PlayersProps[] => {
  if (season && episode) {
    return [
      {
        title: 'VidKing',
        source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}${VIDKING_PARAMS}`,
        recommended: true, fast: true, resumable: true,
      },
      {
        title: 'VidSrc',
        source: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
        recommended: false, fast: false, resumable: false,
      },
      {
        title: 'VidSrc Pro',
        source: `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`,
        recommended: false, fast: true, resumable: false,
      },
      {
        title: 'SuperEmbed',
        source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
        recommended: false, fast: false, resumable: false,
      },
      {
        title: 'AutoEmbed',
        source: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
        recommended: false, fast: false, resumable: false,
      }
    ];
  }

  return [
    {
      title: 'VidKing',
      source: `https://www.vidking.net/embed/movie/${id}${VIDKING_PARAMS}`,
      recommended: true, fast: true, resumable: true,
    },
    {
      title: 'VidSrc',
      source: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      recommended: false, fast: false, resumable: false,
    },
    {
      title: 'VidSrc Pro',
      source: `https://vidsrc.pro/embed/movie/${id}`,
      recommended: false, fast: true, resumable: false,
    },
    {
      title: 'SuperEmbed',
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
      recommended: false, fast: false, resumable: false,
    },
    {
      title: 'AutoEmbed',
      source: `https://player.autoembed.cc/embed/movie/${id}`,
      recommended: false, fast: false, resumable: false,
    }
  ];
};

export const getTvShowPlayers = (id: string | number, season: number, episode: number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidKing',
    source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}${VIDKING_PARAMS}`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidSrc',
    source: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
    recommended: false, fast: false, resumable: false,
  },
  {
    title: 'VidSrc Pro',
    source: `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`,
    recommended: false, fast: true, resumable: false,
  },
  {
    title: 'SuperEmbed',
    source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
    recommended: false, fast: false, resumable: false,
  },
  {
    title: 'AutoEmbed',
    source: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
    recommended: false, fast: false, resumable: false,
  }
];
