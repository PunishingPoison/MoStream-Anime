'use client';

import { siteConfig } from '@/config/site';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiComputerDesktop } from 'react-icons/hi2';

const ThemeSwitchDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button isIconOnly size="sm" variant="light" className="text-foreground/70"><HiComputerDesktop size={18} /></Button>;

  const currentIcon = siteConfig.themes.find((t) => t.name === theme)?.icon || <HiComputerDesktop size={18} />;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light" className="text-foreground/70 hover:text-foreground transition-colors">
          {currentIcon}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme"
        onAction={(key) => setTheme(key as string)}
        selectedKeys={new Set([theme || 'dark'])}
      >
        {siteConfig.themes.map((t) => (
          <DropdownItem key={t.name} startContent={t.icon}>
            {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ThemeSwitchDropdown;
