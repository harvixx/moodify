// src/features/home/components/Playlist.jsx
import { useRef, useCallback } from "react";
import { useTheme } from "../context/Theme.context";

const EMOTION_ACCENT = {
  happy: "#FFD60A", sad: "#6B8CFF", angry: "#FF453A", neutral: "#BF5AF2", relaxed: "#30D158",
};

const Playlist = ({ songs = [], currentSong, emotion, onSelect, onLoadMore, isLoadingMore = false, hasMore = false }) => {
  const { isWhite } = useTheme();
  const accent      = EMOTION_ACCENT[emotion] || "#ffffff";
  const observerRef = useRef(null);

  // Theme-aware colors
  const emptyText    = isWhite ? "rgba(0,0,0,0.3)"  : "rgba(255,255,255,0.2)";
  const emptySubText = isWhite ? "rgba(0,0,0,0.2)"  : "rgba(255,255,255,0.1)";
  const emptyBg      = isWhite ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)";
  const emptyBorder  = isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const titleColor   = isWhite ? "rgba(0,0,0,0.8)"  : "rgba(255,255,255,0.8)";
  const artistColor  = isWhite ? "rgba(0,0,0,0.4)"  : "rgba(255,255,255,0.25)";
  const indexColor   = isWhite ? "rgba(0,0,0,0.2)"  : "rgba(255,255,255,0.2)";
  const hoverBg      = isWhite ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  const thumbBg      = isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const thumbBorder  = isWhite ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const endText      = isWhite ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.1)";
  const spinnerBorder = isWhite ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
  const spinnerTop   = isWhite ? "rgba(0,0,0,0.4)"  : "rgba(255,255,255,0.4)";

  const lastSongRef = useCallback((node) => {
    if (isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore) onLoadMore?.(); },
      { threshold: 0.5 }
    );
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, onLoadMore]);

  if (!songs.length) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: emptyBg, border: `1px solid ${emptyBorder}` }}>🎵</div>
      <div className="text-center">
        <p className="text-sm" style={{ color: emptyText }}>
          {emotion ? "Loading your playlist..." : "Detect mood to load songs"}
        </p>
        <p className="text-xs mt-1" style={{ color: emptySubText }}>Your mood shapes the music</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-0.5 pb-4">
      {songs.map((song, index) => {
        const isActive = currentSong?.youtubeId === song.youtubeId;
        const isLast   = index === songs.length - 1;

        return (
          <button
            key={`${song.youtubeId}-${index}`}
            ref={isLast ? lastSongRef : null}
            onClick={() => onSelect(song)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group"
            style={{
              background:  isActive ? `${accent}10` : "transparent",
              border:      `1px solid ${isActive ? `${accent}25` : "transparent"}`,
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {/* Index / bars */}
            <div className="w-6 flex items-center justify-center flex-shrink-0">
              {isActive ? (
                <div className="flex gap-0.5 items-end h-3.5">
                  {[60, 100, 40].map((h, i) => (
                    <div key={i} className="w-0.5 rounded-full animate-pulse"
                      style={{ height: `${h}%`, background: accent, animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-[11px] group-hover:hidden" style={{ color: indexColor, fontFamily: "'DM Mono', monospace" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs hidden group-hover:block" style={{ color: indexColor }}>▶</span>
                </>
              )}
            </div>

            {/* Thumbnail */}
            <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden"
              style={{ background: thumbBg, border: `1px solid ${thumbBorder}` }}>
              {song.thumbnail
                ? <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-sm">🎵</div>
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate"
                style={{ color: isActive ? accent : titleColor }}>{song.title}</p>
              <p className="text-[11px] truncate mt-0.5"
                style={{ color: artistColor, fontFamily: "'DM Mono', monospace" }}>{song.artist}</p>
            </div>
          </button>
        );
      })}

      {isLoadingMore && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{ borderColor: spinnerBorder, borderTopColor: spinnerTop }} />
          <span className="text-xs" style={{ color: endText, fontFamily: "'DM Mono', monospace" }}>Loading more...</span>
        </div>
      )}

      {!hasMore && songs.length > 0 && (
        <div className="text-center py-4">
          <span className="text-[10px]" style={{ color: endText, fontFamily: "'DM Mono', monospace" }}>
            — end of playlist —
          </span>
        </div>
      )}
    </div>
  );
};

export default Playlist;