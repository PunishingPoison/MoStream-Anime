import { SiteConfigType } from '@/types';
import { GoHomeFill, GoHome } from 'react-icons/go';
import { BiSearchAlt2, BiSolidSearchAlt2 } from 'react-icons/bi';
import { IoCompass, IoCompassOutline } from 'react-icons/io5';
import { TbFolder, TbFolderFilled } from 'react-icons/tb';
import { IoInformationCircle, IoInformationCircleOutline } from 'react-icons/io5';
import { IoIosSunny } from 'react-icons/io';
import { IoMoon } from 'react-icons/io5';
import { HiComputerDesktop } from 'react-icons/hi2';
import { anilist } from '@/api/anilist';

export const siteConfig: SiteConfigType = {
  name: 'MoAnime',
  description: 'Your premier destination for free anime and manga streaming.',
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
        name: "Today's Trending Anime",
        query: () => anilist.trending.trending('movie', 'day'),
        param: 'todayTrending',
      },
      {
        name: "This Week's Trending Anime",
        query: () => anilist.trending.trending('movie', 'week'),
        param: 'thisWeekTrending',
      },
      {
        name: 'Popular Anime',
        query: () => anilist.anime.popular(),
        param: 'popular',
      },
      {
        name: 'Top Rated Anime',
        query: () => anilist.anime.topRated(),
        param: 'topRated',
      },
    ],
    tvShows: [
      {
        name: "Today's Trending Manga",
        query: () => anilist.trending.trending('tv', 'day'),
        param: 'todayTrending',
      },
      {
        name: "This Week's Trending Manga",
        query: () => anilist.trending.trending('tv', 'week'),
        param: 'thisWeekTrending',
      },
      {
        name: 'Popular Manga',
        query: () => anilist.manga.popular(),
        param: 'popular',
      },
      {
        name: 'Top Rated Manga',
        query: () => anilist.manga.topRated(),
        param: 'topRated',
      },
    ],
  },
  socials: {
    github: 'https://github.com/prath/',
  },
};
