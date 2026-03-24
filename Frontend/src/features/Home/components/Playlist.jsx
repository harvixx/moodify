// src/features/home/components/Playlist.jsx
import { useRef, useCallback } from "react";

const EMOTION_ACCENT = {
  happy:   "#FFD60A",
  sad:     "#6B8CFF",
  angry:   "#FF453A",
  neutral: "#BF5AF2",
  relaxed: "#30D158",
};

const EmptyState = ({ emotion }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-3xl">
      🎵
    </div>
    <div className="text-center">
      <p className="text-sm text-white/20">
        {emotion ? "Loading your playlist..." : "Detect mood to load songs"}
      </p>
      <p className="text-xs text-white/10 mt-1">Your mood shapes the music</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Playlist — infinite scroll via IntersectionObserver
// Props:
//   songs         → song array
//   currentSong   → active song
//   emotion       → for accent color
//   onSelect      → fn(song)
//   onLoadMore    → fn() — called when bottom reached
//   isLoadingMore → bool — show spinner
//   hasMore       → bool — aur songs hain?
// ─────────────────────────────────────────────
const Playlist = ({
  songs = [],
  currentSong,
  emotion,
  onSelect,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
}) => {
  const accent        = EMOTION_ACCENT[emotion] || "#ffffff";
  const observerRef   = useRef(null);

  // ── IntersectionObserver — last element visible hone par load more ──
  const lastSongRef = useCallback((node) => {
    if (isLoadingMore) return;

    // Purana observer disconnect karo
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore?.();
        }
      },
      { threshold: 0.5 } // 50% visible hone par trigger
    );

    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, onLoadMore]);

  if (!songs.length) return <EmptyState emotion={emotion} />;

  return (
    <div className="space-y-0.5 pb-4">
      {songs.map((song, index) => {
        const isActive  = currentSong?.youtubeId === song.youtubeId;
        const isLast    = index === songs.length - 1;

        return (
          <button
            key={`${song.youtubeId}-${index}`}
            ref={isLast ? lastSongRef : null} // ✅ last item pe observer
            onClick={() => onSelect(song)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group"
            style={{
              background:  isActive ? `${accent}10` : "transparent",
              border:      `1px solid ${isActive ? `${accent}25` : "transparent"}`,
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Index / playing bars */}
            <div className="w-6 flex items-center justify-center flex-shrink-0">
              {isActive ? (
                <div className="flex gap-0.5 items-end h-3.5">
                  {[60, 100, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full animate-pulse"
                      style={{ height: `${h}%`, background: accent, animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-[11px] text-white/20 group-hover:hidden"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white/30 text-xs hidden group-hover:block">▶</span>
                </>
              )}
            </div>

            {/* Thumbnail */}
            <div className="w-9 h-9 rounded-lg flex-shrink-0 bg-white/[0.05] overflow-hidden border border-white/[0.06]">
              {song.thumbnail ? (
                <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm">🎵</div>
              )}
            </div>

            {/* Title + Artist */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: isActive ? accent : "rgba(255,255,255,0.8)" }}
              >
                {song.title}
              </p>
              <p className="text-[11px] text-white/25 truncate mt-0.5"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {song.artist}
              </p>
            </div>
          </button>
        );
      })}

      {/* ── Loading more spinner ── */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          <span className="text-xs text-white/20" style={{ fontFamily: "'DM Mono', monospace" }}>
            Loading more...
          </span>
        </div>
      )}

      {/* ── No more songs ── */}
      {!hasMore && songs.length > 0 && (
        <div className="text-center py-4">
          <span className="text-[10px] text-white/10" style={{ fontFamily: "'DM Mono', monospace" }}>
            — end of playlist —
          </span>
        </div>
      )}
    </div>
  );
};

export default Playlist;