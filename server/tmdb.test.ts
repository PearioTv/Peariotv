import { describe, expect, it } from "vitest";

describe("TMDB API Key Validation", () => {
  it("should validate TMDB API key by fetching trending movies", async () => {
    const apiKey = process.env.VITE_TMDB_API_KEY;
    
    if (!apiKey) {
      throw new Error("VITE_TMDB_API_KEY environment variable is not set");
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("results");
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeGreaterThan(0);
  });
});
