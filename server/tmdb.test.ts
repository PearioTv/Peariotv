import { describe, expect, it } from "vitest";

describe("TMDB API Key Validation", () => {
  it(
    "validates TMDB API key by fetching popular movies",
    async () => {
      const apiKey = process.env.VITE_TMDB_API_KEY;

      if (!apiKey) {
        throw new Error("VITE_TMDB_API_KEY environment variable is not set");
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("results");
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.results.length).toBeGreaterThan(0);
    },
    { timeout: 15000 }
  );
});
