'use client';

import NavbarMenuItems from '../other/NavbarMenuItems';
import { siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathName = usePathname();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const shouldShowSidebar = hrefs.includes(pathName);

  return (
    <div className="flex h-full">
      {shouldShowSidebar && (
        <div className="hidden md:block">
          <div className="w-[72px] shrink-0" />
          <aside className="fixed left-0 top-0 z-40 h-dvh w-fit pt-16">
            <nav className="flex h-full flex-col justify-start bg-background/90 backdrop-blur-xl pl-1.5 pt-5 text-foreground border-r border-border/30 shadow-lg shadow-black/10">
              <NavbarMenuItems size="sm" isVertical withIcon variant="light" />
            </nav>
          </aside>
        </div>
      )}
      {children}
    </div>
  );
};

export default Sidebar;
