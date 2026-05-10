'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';

interface BackButtonProps {
  href?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ href }) => {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      size="md"
      variant="light"
      className="text-foreground bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all"
      onPress={() => (href ? router.push(href) : router.back())}
    >
      <IoChevronBack size={22} />
    </Button>
  );
};

export default BackButton;
