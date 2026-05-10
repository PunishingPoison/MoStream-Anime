import { PlayersProps } from '@/types';

export const getMoviePlayers = (id: string | number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidKing',
    source: `https://www.vidking.net/embed/movie/${id}?color=e50914&autoplay=false`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidLink',
    source: `https://vidlink.pro/movie/${id}?player=jw&primaryColor=e50914&autoplay=false&startAt=${startAt || ''}`,
    recommended: true, fast: true, ads: true, resumable: true,
  },
  {
    title: 'VidLink 2',
    source: `https://vidlink.pro/movie/${id}?primaryColor=e50914&autoplay=false&startAt=${startAt || ''}`,
    fast: true, ads: true, resumable: true,
  },
  { title: '<Embed>', source: `https://embed.su/embed/movie/${id}`, ads: true },
  { title: 'SuperEmbed', source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`, fast: true, ads: true },
  { title: 'AutoEmbed', source: `https://autoembed.co/movie/tmdb/${id}`, fast: true, ads: true },
  { title: '2Embed', source: `https://www.2embed.cc/embed/${id}`, ads: true },
  { title: 'VidSrc 1', source: `https://vidsrc.xyz/embed/movie/${id}`, ads: true },
  { title: 'VidSrc 2', source: `https://vidsrc.to/embed/movie/${id}`, ads: true },
  { title: 'VidSrc 3', source: `https://vidsrc.icu/embed/movie/${id}`, ads: true },
];

export const getTvShowPlayers = (id: string | number, season: number, episode: number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidKing',
    source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=e50914&autoplay=false`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidLink',
    source: `https://vidlink.pro/tv/${id}/${season}/${episode}?player=jw&primaryColor=e50914&autoplay=false&startAt=${startAt || ''}`,
    recommended: true, fast: true, ads: true, resumable: true,
  },
  {
    title: 'VidLink 2',
    source: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=e50914&autoplay=false&startAt=${startAt || ''}`,
    fast: true, ads: true, resumable: true,
  },
  { title: '<Embed>', source: `https://embed.su/embed/tv/${id}/${season}/${episode}`, ads: true },
  { title: 'SuperEmbed', source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`, fast: true, ads: true },
  { title: 'AutoEmbed', source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`, fast: true, ads: true },
  { title: '2Embed', source: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`, ads: true },
  { title: 'VidSrc 1', source: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`, ads: true },
  { title: 'VidSrc 2', source: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`, ads: true },
  { title: 'VidSrc 3', source: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`, ads: true },
];
