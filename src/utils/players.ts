import { PlayersProps } from '@/types';

export const getMoviePlayers = (id: string | number, season?: number, episode?: number, startAt?: number): PlayersProps[] => {
  const epPath = season && episode ? `/${episode}` : '';
  const epSuffix = season && episode ? `?s=${season}&e=${episode}` : '';

  return [
    {
      title: 'VidSrc',
      source: `https://vidsrc.xyz/embed/anime/${id}${epPath}`,
      recommended: true, fast: true, resumable: true,
    },
    {
      title: 'VidSrc Pro',
      source: `https://vidsrc.to/embed/anime/${id}${epPath}`,
      recommended: true, fast: true, ads: true, resumable: true,
    },
    {
      title: 'VidLink',
      source: `https://vidlink.to/anime/${id}${epSuffix}`,
      fast: true, ads: true,
    },
    {
      title: 'Embed.su',
      source: `https://embed.su/embed/anime/${id}${epPath}`,
      ads: true,
    },
    {
      title: 'Anime Embed',
      source: `https://autoembed.co/anime/tmdb/${id}${epSuffix}`,
      fast: true, ads: true,
    },
    {
      title: 'Megacloud',
      source: `https://megacloud.tv/embed/anime/${id}${epSuffix}`,
      fast: true, ads: true,
    },
    {
      title: 'SuperEmbed',
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1${season && episode ? `&s=${season}&e=${episode}` : ''}`,
      fast: true, ads: true,
    },
  ];
};

export const getTvShowPlayers = (id: string | number, season: number, episode: number, startAt?: number): PlayersProps[] => [
  {
    title: 'VidSrc',
    source: `https://vidsrc.xyz/embed/anime/${id}/${episode}`,
    recommended: true, fast: true, resumable: true,
  },
  {
    title: 'VidSrc Pro',
    source: `https://vidsrc.to/embed/anime/${id}/${episode}`,
    recommended: true, fast: true, ads: true, resumable: true,
  },
  {
    title: 'VidLink',
    source: `https://vidlink.to/anime/${id}?s=${season}&e=${episode}`,
    fast: true, ads: true,
  },
  {
    title: 'Embed.su',
    source: `https://embed.su/embed/anime/${id}/${episode}`,
    ads: true,
  },
  {
    title: 'Anime Embed',
    source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
    fast: true, ads: true,
  },
  {
    title: 'Megacloud',
    source: `https://megacloud.tv/embed/anime/${id}/${episode}`,
    fast: true, ads: true,
  },
  {
    title: 'SuperEmbed',
    source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
    fast: true, ads: true,
  },
];
