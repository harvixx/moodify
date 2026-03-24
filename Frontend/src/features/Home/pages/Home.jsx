// src/features/home/pages/Home.jsx
import { useState, useCallback, useMemo } from "react";
import FaceUI from "../components/FaceUI";
import MoodDisplay from "../components/MoodDisplay";
import Playlist from "../components/Playlist";
import Player from "../components/Player";
import CategoryBar from "../components/CategoryBar";
import SearchBar from "../components/SearchBar";
import ProfileMenu from "../components/ProfileMenu";
import { getSongs } from "../../songs/services/song.api";

// Themes definition - Black is now the first (default) option
const THEMES = [
  { id: "black",    bg: "#000000", accent: "#ffffff" },
  { id: "dark",     bg: "#0a0a0a", accent: "#ffffff" },
  { id: "white",    bg: "#ffffff", accent: "#6366f1" }, 
  { id: "midnight", bg: "#0d0d1a", accent: "#6366f1" },
  { id: "forest",   bg: "#0a120a", accent: "#30D158" },
  { id: "rose",     bg: "#120a0a", accent: "#FF453A" },
];

const Home = () => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [songs, setSongs]                   = useState([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [nextPageToken, setNextPageToken]   = useState(null);
  const [currentQuery, setCurrentQuery]     = useState("");
  const [isLoadingMore, setIsLoadingMore]   = useState(false);
  const [hasMore, setHasMore]               = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  
  // Default theme is now Black
  const [theme, setTheme] = useState(THEMES[0]);

  const currentSong = songs[currentIndex] || null;

  // ── Dynamic Theme Helpers ──
  const isWhiteTheme = theme.id === "white";
  const textColor = isWhiteTheme ? "text-gray-900" : "text-white";
  const subTextColor = isWhiteTheme ? "text-gray-500" : "text-white/30";
  const borderColor = isWhiteTheme ? "border-black/[0.08]" : "border-white/[0.06]";
  const secondaryBorder = isWhiteTheme ? "border-black/[0.05]" : "border-white/[0.04]";

  // ── Handlers ──
  const applyNewSongs = useCallback((response, emotion = null) => {
    setSongs(response.songs || []);
    setCurrentIndex(0);
    setNextPageToken(response.nextPageToken || null);
    setCurrentQuery(response.query || "");
    setHasMore(!!response.nextPageToken);
    if (emotion) setCurrentEmotion(emotion);
  }, []);

  const handleSongsLoaded = useCallback((newSongs, emotion, query, nextToken) => {
    setSongs(newSongs || []);
    setCurrentEmotion(emotion);
    setCurrentIndex(0);
    setNextPageToken(nextToken || null);
    setCurrentQuery(query || "");
    setHasMore(!!nextToken);
    setActiveCategory(null);
    setSearchQuery("");
  }, []);

  const handleCategorySelect = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setActiveCategory(categoryId);
    setSearchQuery("");
    setCurrentEmotion(null);
    try {
      const response = await getSongs({ category: categoryId });
      applyNewSongs(response);
    } catch (err) {
      console.error("Category fetch failed:", err);
    }
  }, [applyNewSongs]);

  const handleSearch = useCallback(async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchQuery("");
      return;
    }
    setSearchQuery(trimmedQuery);
    setActiveCategory(null);
    setCurrentEmotion(null);
    try {
      const response = await getSongs({ query: trimmedQuery });
      applyNewSongs(response);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, [applyNewSongs]);

  const handleThemeChange = (newThemeData) => {
    if (typeof newThemeData === "string") {
      const found = THEMES.find(t => t.id === newThemeData);
      if (found) setTheme(found);
    } else {
      setTheme(newThemeData);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await getSongs({
        emotion:    currentEmotion,
        pageToken:  nextPageToken,
        query:      currentQuery,
      });
      setSongs((prev) => [...prev, ...(response.songs || [])]);
      setNextPageToken(response.nextPageToken || null);
      setHasMore(!!response.nextPageToken);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextPageToken, isLoadingMore, currentEmotion, currentQuery]);

  const handleSongSelect = useCallback((song) => {
    const idx = songs.findIndex((s) => s.youtubeId === song.youtubeId);
    if (idx !== -1) setCurrentIndex(idx);
  }, [songs]);

  const handleNext = useCallback((shuffle = false) => {
    if (songs.length === 0) return;
    if (shuffle) {
      let idx;
      do { idx = Math.floor(Math.random() * songs.length); }
      while (idx === currentIndex && songs.length > 1);
      setCurrentIndex(idx);
    } else {
      setCurrentIndex((p) => (p + 1) % songs.length);
    }
  }, [songs.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIndex((p) => (p - 1 + songs.length) % songs.length);
  }, [songs.length]);

  return (
    <div
      className={`min-h-screen ${textColor} overflow-hidden transition-colors duration-500`}
      style={{
        fontFamily: "'Syne', sans-serif",
        background: theme.bg,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: ${isWhiteTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}; 
          border-radius: 99px; 
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu  { animation: fadeUp 0.4s ease both; }
        .fu1 { animation: fadeUp 0.4s 0.08s ease both; }
        .fu2 { animation: fadeUp 0.4s 0.16s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`flex items-center justify-between px-6 py-4 border-b ${borderColor} fu relative z-50`}>
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors"
            style={{ 
              background: isWhiteTheme ? "#f3f4f6" : "rgba(255,255,255,0.08)", 
              color: theme.accent 
            }}
          >
            M
          </div>
          <span className="text-sm font-bold tracking-tight">
            Moodify <span className={isWhiteTheme ? "text-gray-400" : "text-white/25"}>AI</span>
          </span>
        </div>

        <div className={`flex items-center gap-2 ${isWhiteTheme ? 'bg-gray-100' : 'bg-white/[0.04]'} border ${borderColor} rounded-full px-3 py-1`}>
          <span 
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ 
               backgroundColor: currentEmotion ? theme.accent : (isWhiteTheme ? "#d1d5db" : "rgba(255,255,255,0.15)"),
               boxShadow: currentEmotion ? `0 0 8px ${theme.accent}` : "none"
            }} 
          />
          <span className={`text-[11px] ${subTextColor}`} style={{ fontFamily: "'DM Mono', monospace" }}>
            {searchQuery
              ? `search · ${searchQuery.slice(0, 12)}${searchQuery.length > 12 ? "..." : ""}`
              : activeCategory
              ? `category · ${activeCategory}`
              : currentEmotion || "not detecting"}
          </span>
        </div>

        <ProfileMenu onThemeChange={handleThemeChange} currentTheme={theme.id} />
      </nav>

      {/* ── Main Layout ── */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* LEFT — Camera */}
        <div className={`w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col gap-4 p-4 border-r ${borderColor} overflow-y-auto fu1`}>
          <SLabel isWhite={isWhiteTheme}>Expression Capture</SLabel>
          <FaceUI onSongsLoaded={handleSongsLoaded} />
          {currentEmotion && !activeCategory && !searchQuery && (
            <MoodDisplay emotion={currentEmotion} accent={theme.accent} isWhite={isWhiteTheme} />
          )}
        </div>

        {/* CENTER — Search + Categories + Playlist */}
        <div className="flex-1 flex flex-col overflow-hidden fu1">
          <div className={`px-4 pt-4 pb-2 border-b ${secondaryBorder} flex-shrink-0`}>
            <SearchBar onSearch={handleSearch} activeQuery={searchQuery} isWhite={isWhiteTheme} />
          </div>

          <div className={`border-b ${secondaryBorder} flex-shrink-0`}>
            <CategoryBar activeCategory={activeCategory} onSelect={handleCategorySelect} isWhite={isWhiteTheme} />
          </div>

          <div className="px-5 pt-3 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <SLabel isWhite={isWhiteTheme}>
                {searchQuery
                  ? `Results · "${searchQuery}"`
                  : activeCategory
                  ? `${activeCategory} playlist`
                  : "AI Playlist"}
              </SLabel>
              {songs.length > 0 && (
                <span className={`text-[10px] ${isWhiteTheme ? 'text-gray-300' : 'text-white/15'} ml-1`} style={{ fontFamily: "'DM Mono', monospace" }}>
                  {songs.length} tracks
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-2">
            <Playlist
              songs={songs}
              currentSong={currentSong}
              emotion={currentEmotion}
              onSelect={handleSongSelect}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              accent={theme.accent}
              isWhite={isWhiteTheme}
            />
          </div>
        </div>

        {/* RIGHT — Player */}
        <div className={`w-[300px] xl:w-[340px] flex-shrink-0 border-l ${borderColor} flex flex-col fu2`}>
          <div className={`p-4 border-b ${secondaryBorder} flex-shrink-0`}>
            <SLabel isWhite={isWhiteTheme}>Now Playing</SLabel>
          </div>
          <div className="flex-1 p-5 overflow-y-auto">
            <Player
              song={currentSong}
              emotion={currentEmotion}
              onNext={handleNext}
              onPrev={handlePrev}
              accent={theme.accent}
              isWhite={isWhiteTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SLabel = ({ children, isWhite }) => (
  <div className="flex items-center gap-2 w-full">
    <span
      className={`text-[10px] ${isWhite ? 'text-gray-400' : 'text-white/20'} uppercase tracking-widest flex-shrink-0`}
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {children}
    </span>
    <div className={`flex-1 h-px ${isWhite ? 'bg-black/[0.05]' : 'bg-white/[0.04]'}`} />
  </div>
);

export default Home;