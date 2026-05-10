'use client';

import { cn } from '@/utils/helpers';
import { siteConfig } from '@/config/site';
import { Link } from '@heroui/link';
import { usePathname } from 'next/navigation';
import { Chip } from '@heroui/chip';
import clsx from 'clsx';

const BottomNavbar = () => {
  const pathName = usePathname();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);

  return (
    show && (
      <>
        <div className="pb-[68px] md:hidden" />
        <div className="fixed bottom-0 left-0 z-50 block h-fit w-full border-t border-white/10 bg-background/90 backdrop-blur-xl pb-safe-bottom py-1.5 shadow-2xl shadow-black/30 md:hidden">
          <div className="mx-auto grid h-full max-w-lg grid-cols-5">
            {siteConfig.navItems.map((item) => {
              const isActive = pathName === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="flex items-center justify-center text-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-0.5 py-1">
                    <Chip
                      size="lg"
                      variant={isActive ? 'solid' : 'light'}
                      classNames={{
                        base: cn(
                          'py-[2px] transition-all duration-300',
                          isActive ? 'scale-110' : 'opacity-50',
                        ),
                        content: 'size-full',
                      }}
                    >
                      {isActive ? item.activeIcon : item.icon}
                    </Chip>
                    <p className={clsx('text-[10px] leading-none transition-all duration-300', { 'font-bold text-primary': isActive, 'opacity-50': !isActive })}>{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    )
  );
};

export default BottomNavbar;
