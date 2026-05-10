import { SiteConfigType } from '@/types';
import { tmdb } from '@/api/tmdb';
import { GoHomeFill, GoHome } from 'react-icons/go';
import { BiSearchAlt2, BiSolidSearchAlt2 } from 'react-icons/bi';
import { IoCompass, IoCompassOutline } from 'react-icons/io5';
import { TbFolder, TbFolderFilled } from 'react-icons/tb';
import { IoInformationCircle, IoInformationCircleOutline } from 'react-icons/io5';
import { IoIosSunny } from 'react-icons/io';
import { IoMoon } from 'react-icons/io5';
import { HiComputerDesktop } from 'react-icons/hi2';

export const siteConfig: SiteConfigType = {
  name: 'Mostream',
  description: 'Your only choice for a free movies and TV shows streaming website.',
  favicon: '/favicon.ico',
  navItems: [
    {
      label: 'Home',
      href: '/',
      icon: <GoHome className="size-full" />,
      activeIcon: <GoHomeFill className="size-full" />,
    },
    {
      label: 'Discover',
      href: '/discover',
      icon: <IoCompassOutline className="size-full" />,
      activeIcon: <IoCompass className="size-full" />,
    },
    {
      label: 'Search',
      href: '/search',
      icon: <BiSearchAlt2 className="size-full" />,
      activeIcon: <BiSolidSearchAlt2 className="size-full" />,
    },
    {
      label: 'Library',
      href: '/library',
      icon: <TbFolder className="size-full" />,
      activeIcon: <TbFolderFilled className="size-full" />,
    },
    {
      label: 'About',
      href: '/about',
      icon: <IoInformationCircleOutline className="size-full" />,
      activeIcon: <IoInformationCircle className="size-full" />,
    },
  ],
  themes: [
    { name: 'light', icon: <IoIosSunny className="size-full" /> },
    { name: 'dark', icon: <IoMoon className="size-full" /> },
    { name: 'system', icon: <HiComputerDesktop className="size-full" /> },
  ],
  queryLists: {
    movies: [
      {
        name: "Today's Trending Movies",
        query: () => tmdb.trending.trending('movie', 'day'),
        param: 'todayTrending',
      },
      {
        name: "This Week's Trending Movies",
        query: () => tmdb.trending.trending('movie', 'week'),
        param: 'thisWeekTrending',
      },
      {
        name: 'Popular Movies',
        query: () => tmdb.movies.popular(),
        param: 'popular',
      },
      {
        name: 'Now Playing Movies',
        query: () => tmdb.movies.nowPlaying(),
        param: 'nowPlaying',
      },
      {
        name: 'Upcoming Movies',
        query: () => tmdb.movies.upcoming(),
        param: 'upcoming',
      },
      {
        name: 'Top Rated Movies',
        query: () => tmdb.movies.topRated(),
        param: 'topRated',
      },
    ],
    tvShows: [
      {
        name: "Today's Trending TV Shows",
        query: () => tmdb.trending.trending('tv', 'day'),
        param: 'todayTrending',
      },
      {
        name: "This Week's Trending TV Shows",
        query: () => tmdb.trending.trending('tv', 'week'),
        param: 'thisWeekTrending',
      },
      {
        name: 'Popular TV Shows',
        query: () => tmdb.tvShows.popular(),
        param: 'popular',
      },
      {
        name: 'On The Air TV Shows',
        query: () => tmdb.tvShows.onTheAir(),
        param: 'onTheAir',
      },
      {
        name: 'Top Rated TV Shows',
        query: () => tmdb.tvShows.topRated(),
        param: 'topRated',
      },
    ],
  },
  socials: {
    github: 'https://github.com/prath/',
  },
};
