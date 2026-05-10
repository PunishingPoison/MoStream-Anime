'use client';

import { cn } from '@/utils/helpers';
import { siteConfig } from '@/config/site';
import { Button, Tooltip } from '@heroui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavbarMenuItemsProps {
  size?: 'sm' | 'md' | 'lg';
  isVertical?: boolean;
  withIcon?: boolean;
  variant?: 'light' | 'solid' | 'flat' | 'faded' | 'shadow' | 'ghost' | 'bordered';
}

const NavbarMenuItems: React.FC<NavbarMenuItemsProps> = ({
  size = 'md',
  isVertical = false,
  withIcon = false,
  variant = 'light',
}) => {
  const pathName = usePathname();

  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-center gap-3' : 'items-center gap-1'}`}
    >
      {siteConfig.navItems.map((item) => {
        const isActive = pathName === item.href;
        return (
          <Tooltip key={item.href} content={item.label} placement="right" delay={500}>
            <Button
              as={Link}
              href={item.href}
              size={size}
              variant={isActive ? 'flat' : variant}
              color={isActive ? 'primary' : 'default'}
              isIconOnly={withIcon}
              className={cn(
                'transition-all duration-200',
                isActive ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-foreground hover:bg-white/5',
                !withIcon ? 'min-w-0 px-2' : '',
                isVertical && withIcon && isActive ? 'scale-110' : '',
                isVertical && withIcon && 'rounded-xl mx-1.5 my-0.5 md:my-1',
              )}
            >
              {withIcon ? (
                isActive ? item.activeIcon : item.icon
              ) : (
                item.label
              )}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default NavbarMenuItems;
