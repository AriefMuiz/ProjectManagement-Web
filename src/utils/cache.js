// src/utils/cache.js
export const createCache = (prefix, expiry = 24 * 60 * 60 * 1000) => {
  return {
    get: (key) => {
      try {
        const cacheKey = `${prefix}_${key}`;
        const cachedItem = localStorage.getItem(cacheKey);
        if (!cachedItem) return null;

        const { data, timestamp } = JSON.parse(cachedItem);
        if (Date.now() - timestamp > expiry) {
          localStorage.removeItem(cacheKey);
          return null;
        }
        return data;
      } catch (error) {
        console.error(`Cache read error (${key}):`, error);
        return null;
      }
    },

    set: (key, data) => {
      try {
        const cacheKey = `${prefix}_${key}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error(`Cache write error (${key}):`, error);
      }
    }
  };
};