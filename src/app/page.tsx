import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/Home/HeroSection'));
const HomePageList = dynamic(() => import('@/components/sections/Home/List'));

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HomePageList />
    </div>
  );
}
