'use client';

import { Drawer } from 'vaul';
import { cn } from '@/utils/helpers';
import { Button } from '@heroui/react';
import { IoClose } from 'react-icons/io5';

interface VaulDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  hiddenTitle?: boolean;
  hiddenHandler?: boolean;
  withCloseButton?: boolean;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  backdrop?: 'transparent' | 'blur' | 'opaque';
  classNames?: { content?: string };
  children: React.ReactNode;
}

const VaulDrawer: React.FC<VaulDrawerProps> = ({
  open,
  onOpenChange,
  title,
  hiddenTitle,
  hiddenHandler,
  withCloseButton,
  direction = 'bottom',
  backdrop,
  classNames,
  children,
}) => {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={direction}>
      <Drawer.Portal>
        <Drawer.Overlay className={`fixed inset-0 z-40 ${backdrop === 'blur' ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/40'}`} />
        <Drawer.Content
          className={cn(
            'fixed z-50 flex flex-col bg-background border border-white/10',
            direction === 'right' && 'bottom-0 right-0 top-0 w-full max-w-md shadow-2xl shadow-black/30',
            direction === 'bottom' && 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-xl shadow-2xl shadow-black/30',
            classNames?.content,
          )}
        >
          {!hiddenHandler && direction === 'bottom' && (
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          )}
          <div className={cn('flex items-center justify-between px-4 py-3', hiddenTitle && 'hidden')}>
            <Drawer.Title className="text-lg font-bold">{title}</Drawer.Title>
            {withCloseButton && (
              <Button isIconOnly size="sm" variant="light" onPress={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
                <IoClose size={20} />
              </Button>
            )}
          </div>
          <div className="overflow-y-auto">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default VaulDrawer;
