export type Language = "en" | "ar";

export const translations = {
  en: {
    // Navigation
    home: "Home",
    movies: "Movies",
    tvShows: "TV Shows",
    search: "Search",
    favorites: "Favorites",
    watchlist: "Watchlist",
    language: "Language",
    logout: "Logout",
    login: "Login",

    // Home Page
    popularMovies: "Popular Movies",
    trendingMovies: "Trending Movies",
    upcomingMovies: "Upcoming Movies",
    popularShows: "Popular TV Shows",
    trendingShows: "Trending TV Shows",
    newReleases: "New Releases",
    allGenres: "All Genres",

    // Detail Page
    cast: "Cast",
    ratingLabel: "Rating",
    year: "Year",
    duration: "Duration",
    overview: "Overview",
    episodes: "Episodes",
    seasons: "Seasons",
    season: "Season",
    episode: "Episode",
    watchNow: "Watch Now",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    addToWatchlist: "Add to Watchlist",
    removeFromWatchlist: "Remove from Watchlist",
    nextEpisode: "Next Episode",
    autoPlay: "Auto Play",

    // Search
    searchResults: "Search Results",
    noResults: "No results found",
    filterByGenre: "Filter by Genre",
    filterByYear: "Filter by Year",
    sortBy: "Sort By",
    popularity: "Popularity",
    releaseDate: "Release Date",

    // User
    myFavorites: "My Favorites",
    myWatchlist: "My Watchlist",
    settings: "Settings",
    theme: "Theme",
    dark: "Dark",
    light: "Light",

    // Messages
    loading: "Loading...",
    error: "An error occurred",
    tryAgain: "Try Again",
    noFavorites: "No favorites yet",
    noWatchlist: "Your watchlist is empty",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    movies: "الأفلام",
    tvShows: "المسلسلات",
    search: "بحث",
    favorites: "المفضلة",
    watchlist: "قائمة المشاهدة",
    language: "اللغة",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",

    // Home Page
    popularMovies: "الأفلام الشهيرة",
    trendingMovies: "الأفلام الرائجة",
    upcomingMovies: "الأفلام القادمة",
    popularShows: "المسلسلات الشهيرة",
    trendingShows: "المسلسلات الرائجة",
    newReleases: "الإصدارات الجديدة",
    allGenres: "جميع الأنواع",

    // Detail Page
    cast: "الممثلون",
    ratingLabel: "التقييم",
    year: "السنة",
    duration: "المدة",
    overview: "نظرة عامة",
    episodes: "الحلقات",
    seasons: "المواسم",
    season: "الموسم",
    episode: "الحلقة",
    watchNow: "شاهد الآن",
    addToFavorites: "أضف إلى المفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    addToWatchlist: "أضف إلى قائمة المشاهدة",
    removeFromWatchlist: "إزالة من قائمة المشاهدة",
    nextEpisode: "الحلقة التالية",
    autoPlay: "التشغيل التلقائي",

    // Search
    searchResults: "نتائج البحث",
    noResults: "لم يتم العثور على نتائج",
    filterByGenre: "تصفية حسب النوع",
    filterByYear: "تصفية حسب السنة",
    sortBy: "ترتيب حسب",
    popularity: "الشهرة",
    releaseDate: "تاريخ الإصدار",

    // User
    myFavorites: "مفضلاتي",
    myWatchlist: "قائمة مشاهدتي",
    settings: "الإعدادات",
    theme: "المظهر",
    dark: "داكن",
    light: "فاتح",

    // Messages
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    tryAgain: "حاول مرة أخرى",
    noFavorites: "لا توجد مفضلات حتى الآن",
    noWatchlist: "قائمة المشاهدة فارغة",
  },
};

export function t(key: keyof typeof translations.en, language: Language = "en"): string {
  return translations[language]?.[key as keyof typeof translations.en] || key;
}
