import { PlayersProps } from '@/types';

export const getMoviePlayers = (id: string | number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidSrc',
    source: `https://vidsrc.xyz/embed/anime/${id}`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidSrc 2',
    source: `https://vidsrc.to/embed/anime/${id}`,
    recommended: true, fast: true, ads: true, resumable: true,
  },
  {
    title: 'VidSrc 3',
    source: `https://vidsrc.icu/embed/anime/${id}`,
    fast: true, ads: true, resumable: true,
  },
  {
    title: 'Embed.su',
    source: `https://embed.su/embed/anime/${id}`,
    ads: true,
  },
  {
    title: 'AutoEmbed',
    source: `https://autoembed.co/anime/tmdb/${id}`,
    fast: true, ads: true,
  },
  {
    title: '2Embed',
    source: `https://www.2embed.cc/embed/${id}`,
    ads: true,
  },
  {
    title: 'SuperEmbed',
    source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    fast: true, ads: true,
  },
];

export const getTvShowPlayers = (id: string | number, season: number, episode: number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidSrc',
    source: `https://vidsrc.xyz/embed/anime/${id}/${episode}`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidSrc 2',
    source: `https://vidsrc.to/embed/anime/${id}/${episode}`,
    recommended: true, fast: true, ads: true, resumable: true,
  },
  {
    title: 'VidSrc 3',
    source: `https://vidsrc.icu/embed/anime/${id}/${episode}`,
    fast: true, ads: true, resumable: true,
  },
  {
    title: 'Embed.su',
    source: `https://embed.su/embed/anime/${id}/${episode}`,
    ads: true,
  },
  {
    title: 'AutoEmbed',
    source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
    fast: true, ads: true,
  },
  {
    title: '2Embed',
    source: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    ads: true,
  },
  {
    title: 'SuperEmbed',
    source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
    fast: true, ads: true,
  },
];
