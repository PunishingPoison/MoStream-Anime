'use client';

import { Button } from '@heroui/react';
import { IoChevronUp } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return visible ? (
    <Button
      isIconOnly
      size="sm"
      variant="flat"
      className="fixed bottom-20 right-4 z-40 bg-primary/80 text-white hover:bg-primary shadow-lg shadow-primary/30 md:bottom-6 transition-all duration-300 hover:scale-110"
      onPress={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <IoChevronUp size={18} />
    </Button>
  ) : null;
};

export default BackToTopButton;
