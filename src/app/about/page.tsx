import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <svg viewBox="0 0 32 32" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#3b82f6" />
            <path d="M10 8l12 8-12 8V8z" fill="white" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">About {siteConfig.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your premier destination for free anime & manga streaming</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <section className="rounded-xl border border-white/10 bg-secondary-background p-6 md:p-8 shadow-lg shadow-black/10">
          <p className="leading-relaxed text-muted-foreground">
            {siteConfig.name} is a free, open-source streaming platform that allows you to discover
            and enjoy a vast library of anime and manga. Built with modern web technologies,
            it provides a seamless and enjoyable viewing experience.
          </p>
        </section>
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight text-foreground">Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Browse Content', desc: 'Trending, popular, and top-rated anime & manga' },
              { title: 'Search', desc: 'Powerful search to find your favorite content' },
              { title: 'Library', desc: 'Save bookmarks for later viewing' },
              { title: 'Responsive', desc: 'Seamless experience on all devices' },
              { title: 'Multiple Sources', desc: 'Choose from various streaming source options' },
              { title: 'Theme Support', desc: 'Dark and light mode available' },
            ].map((f) => (
              <div key={f.title} className="card-hover rounded-lg border border-white/10 bg-secondary-background p-4 shadow-sm">
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-white/10 bg-secondary-background p-6 md:p-8 shadow-lg shadow-black/10">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 size-5 shrink-0 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">Disclaimer</h2>
              <p className="leading-relaxed text-muted-foreground">
                {siteConfig.name} does not host any copyrighted content. All metadata is sourced from
                AniList, and content is streamed through third-party embed players. We are not
                responsible for the content displayed by these third-party services.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">Powered By</h2>
          <div className="flex flex-wrap gap-2">
            {            ['Next.js', 'TypeScript', 'Tailwind CSS', 'HeroUI', 'TanStack Query', 'AniList API'].map(
              (tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-secondary-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30">
                  {tech}
                </span>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
