'use client';

import BackButton from '@/components/ui/button/BackButton';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/helpers';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { useWindowScroll } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import SearchInput from '../input/SearchInput';
import ThemeSwitchDropdown from '../input/ThemeSwitchDropdown';
import BrandLogo from '../other/BrandLogo';
import { FormEvent, useState } from 'react';

const TopNavbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [{ y }] = useWindowScroll();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const isNavPage = hrefs.includes(pathName);
  const isMoviePage = pathName.startsWith('/movie/') && !pathName.endsWith('/player');
  const isTvPage = pathName.startsWith('/tv/') && !pathName.endsWith('/player');
  const player = pathName.includes('/player');
  const isDetailPage = isMoviePage || isTvPage;
  const scrolled = y > 50;

  if (player) return null;

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      classNames={{ wrapper: 'px-3 md:px-8 py-3 md:py-4' }}
      className={cn(
        'inset-0 h-min border-b transition-all duration-500',
        scrolled ? 'border-white/10' : 'border-transparent',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 h-full w-full transition-all duration-500',
          scrolled
            ? 'glass-effect-strong'
            : isNavPage
              ? 'bg-background'
              : '',
        )}
        style={
          !scrolled && !isNavPage
            ? { background: `linear-gradient(to bottom, rgba(13,12,15,${Math.min(y / 200, 0.5)}) 0%, transparent 100%)` }
            : undefined
        }
      />

      {/* Bottom red accent line that fades in on scroll */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-500',
          scrolled ? 'opacity-60' : 'opacity-0',
        )}
      />

      <NavbarBrand className="z-10 flex items-center gap-4">
        {isDetailPage && (
          <BackButton href={isTvPage ? '/?content=tv' : '/?content=movie'} />
        )}
        <BrandLogo />
      </NavbarBrand>

      {isNavPage && pathName !== '/' && !pathName.startsWith('/search') && (
        <NavbarContent className="flex w-full max-w-xs gap-2 sm:max-w-sm md:max-w-md lg:max-w-lg" justify="center">
          <NavbarItem className="w-full">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="w-full"
            >
              <SearchInput
                placeholder="Search anime & manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent justify="end" className="z-10">
        <NavbarItem className="flex gap-1">
          <ThemeSwitchDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
