import { siteConfig } from '@/config/site';
import Link from 'next/link';

const BrandLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 md:gap-3 group">
      <div className="relative shrink-0">
        <img
          src="/android-chrome-192x192.png"
          alt="MoAnime"
          className="size-9 md:size-10 rounded-xl transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute -inset-1 rounded-xl bg-primary/25 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span
        className="text-xl md:text-2xl font-black tracking-widest text-foreground"
        style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.12)' }}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
};

export default BrandLogo;
