'use client';

import { Button } from '@heroui/react';
import { useDisclosure } from '@mantine/hooks';
import { FaPlay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface TrailerProps {
  videos?: { key: string; name: string; site: string; type: string }[];
  color?: 'primary' | 'warning';
}

const Trailer: React.FC<TrailerProps> = ({ videos, color = 'primary' }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const trailer = videos?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');

  if (!trailer) return null;

  return (
    <>
      <Button
        variant="flat"
        color={color}
        startContent={<FaPlay size={14} />}
        onPress={open}
        className="font-medium"
      >
        Trailer
      </Button>
      {opened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in" onClick={close}>
          <div className="relative w-full max-w-4xl aspect-video mx-4 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
              onPress={close}
            >
              <IoClose size={24} />
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-xl shadow-2xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Trailer;
