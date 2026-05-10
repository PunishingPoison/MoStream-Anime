import { useState, useEffect } from 'react';

const useBreakpoints = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { mobile };
};

export default useBreakpoints;
