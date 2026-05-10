const IMG_BASE = 'https://image.tmdb.org/t/p';
const PLACEHOLDERS = {
  poster: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 450%22%3E%3Crect fill=%22%231a1a2e%22 width=%22300%22 height=%22450%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2216%22 x=%22150%22 y=%22225%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E',
  backdrop: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 169%22%3E%3Crect fill=%22%231a1a2e%22 width=%22300%22 height=%22169%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2216%22 x=%22150%22 y=%2284%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E',
  title: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%231a1a2e%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2216%22 x=%22150%22 y=%22150%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E',
};

export function getImageUrl(path?: string | null, size: 'poster' | 'backdrop' | 'title' = 'poster'): string {
  if (!path) return PLACEHOLDERS[size];
  const sizes = { poster: '/w500', backdrop: '/w1280', title: '/w300' };
  return `${IMG_BASE}${sizes[size]}${path}`;
}

export function movieDurationString(minutes?: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function mutateMovieTitle(movie: any): string {
  return movie?.title || movie?.name || '';
}

export function mutateTvShowTitle(tv: any): string {
  return tv?.name || tv?.title || '';
}

const loadingLabels = ['Loading...', 'Fetching data...', 'Almost there...', 'Please wait...'];
let labelIndex = 0;

export function getLoadingLabel(): string {
  const label = loadingLabels[labelIndex % loadingLabels.length];
  labelIndex++;
  return label;
}
