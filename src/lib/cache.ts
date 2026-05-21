export class TTLCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs: number = 60000 * 60) { // Default 1 hour
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return item.value;
  }

  set(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    this.cache.set(key, { value, expiry: Date.now() + ttlMs });
  }

  async getOrFetch(key: string, fetcher: () => Promise<T>, ttlMs: number = this.defaultTtlMs): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;
    
    const value = await fetcher();
    this.set(key, value, ttlMs);
    return value;
  }
}

export const mangaCache = new TTLCache<any>(60000 * 60 * 24); // 24 hours for manga info
