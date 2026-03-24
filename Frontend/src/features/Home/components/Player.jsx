// src/features/home/components/Player.jsx
import { useState, useRef, useEffect, useCallback } from "react";

const EMOTION_ACCENT = {
  happy:   "#FFD60A",
  sad:     "#6B8CFF",
  angry:   "#FF453A",
  neutral: "#BF5AF2",
  relaxed: "#30D158",
};

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// Repeat modes
const REPEAT = { OFF: "off", ONE: "one", ALL: "all" };

const NoSong = () => (
  <div className="flex flex-col items-center justify-center flex-1 gap-3 py-10">
    <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-4xl">
      🎵
    </div>
    <p className="text-xs text-white/20 text-center">
      Detect your mood<br />to get started
    </p>
  </div>
);

const Player = ({ song, emotion, onNext, onPrev }) => {
  const playerRef    = useRef(null);  // YT.Player instance
  const containerRef = useRef(null);  // div for YT iframe
  const intervalRef  = useRef(null);

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [duration,     setDuration]     = useState(0);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [volume,       setVolume]       = useState(80);
  const [isMuted,      setIsMuted]      = useState(false);
  const [repeat,       setRepeat]       = useState(REPEAT.OFF);
  const [isShuffle,    setIsShuffle]    = useState(false);
  const [isReady,      setIsReady]      = useState(false);

  const accent = EMOTION_ACCENT[emotion] || "#ffffff";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Load YouTube IFrame API ──
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    window.onYouTubeIframeAPIReady = () => initPlayer();

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }, []);

  // ── Init YT.Player ──
  const initPlayer = () => {
    if (!containerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: "1",
      width:  "1",
      videoId: "",
      playerVars: {
        autoplay:       0,
        controls:       0,
        modestbranding: 1,
        rel:            0,
        fs:             0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e) => {
          setIsReady(true);
          e.target.setVolume(volume);
        },
        onStateChange: handleStateChange,
      },
    });
  };

  // ── YT Player state change ──
  const handleStateChange = useCallback((e) => {
    const state = e.data;

    // Playing
    if (state === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(e.target.getDuration());

      // Progress ticker
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentTime(e.target.getCurrentTime());
      }, 500);
    }

    // Paused
    if (state === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    }

    // Ended
    if (state === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      setCurrentTime(0);

      if (repeat === REPEAT.ONE) {
        playerRef.current?.seekTo(0);
        playerRef.current?.playVideo();
      } else if (repeat === REPEAT.ALL || repeat === REPEAT.OFF) {
        onNext?.(isShuffle);
      }
    }
  }, [repeat, isShuffle, onNext]);

  // ── New song → load + play ──
  useEffect(() => {
    if (!isReady || !song?.youtubeId) return;

    clearInterval(intervalRef.current);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    playerRef.current?.loadVideoById(song.youtubeId);
    // autoplay after load
    setTimeout(() => {
      playerRef.current?.playVideo();
    }, 300);
  }, [song?.youtubeId, isReady]);

  // Volume sync
  useEffect(() => {
    if (!isReady) return;
    if (isMuted) {
      playerRef.current?.mute();
    } else {
      playerRef.current?.unMute();
      playerRef.current?.setVolume(volume);
    }
  }, [volume, isMuted, isReady]);

  // Cleanup
  useEffect(() => () => clearInterval(intervalRef.current), []);

  // ── Controls ──
  const togglePlay = () => {
    if (!isReady) return;
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  const handleSeek = (e) => {
    if (!isReady || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pct * duration;
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  };

  const cycleRepeat = () => {
    setRepeat((r) => r === REPEAT.OFF ? REPEAT.ALL : r === REPEAT.ALL ? REPEAT.ONE : REPEAT.OFF);
  };

  if (!song) return (
    <div className="flex flex-col h-full">
      {/* Hidden YT container — always mounted */}
      <div ref={containerRef} style={{ position: "absolute", width: 1, height: 1, opacity: 0, top: -9999 }} />
      <NoSong />
    </div>
  );

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* Hidden YouTube player div */}
      <div ref={containerRef} style={{ position: "absolute", width: 1, height: 1, opacity: 0, top: -9999, left: -9999 }} />

      {/* ── Album Art ── */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative w-44 h-44 rounded-2xl overflow-hidden border border-white/[0.08] flex-shrink-0"
          style={{ boxShadow: `0 8px 40px ${accent}30` }}
        >
          {song.thumbnail ? (
            <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `${accent}12` }}>
              🎵
            </div>
          )}
          {isPlaying && (
            <div className="absolute inset-0 animate-pulse opacity-10" style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
          )}
        </div>

        {/* Song info */}
        <div className="text-center w-full px-2">
          <p className="text-base font-semibold text-white truncate leading-snug">{song.title}</p>
          <p className="text-xs text-white/35 truncate mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
            {song.artist}
          </p>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div>
        <div
          className="relative h-1 bg-white/[0.07] rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent}80, ${accent})` }}
          />
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: "translate(-50%, -50%)", background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-white/20" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(currentTime)}</span>
          <span className="text-[10px] text-white/20" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(duration)}</span>
        </div>
      </div>

      {/* ── Main Controls ── */}
      <div className="flex items-center justify-between px-2">

        {/* Shuffle */}
        <button
          onClick={() => setIsShuffle((s) => !s)}
          className="p-2 transition-colors"
          style={{ color: isShuffle ? accent : "rgba(255,255,255,0.25)" }}
          title="Shuffle"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-13 h-13 rounded-full flex items-center justify-center transition-all active:scale-95 hover:scale-105"
          style={{
            width: 52, height: 52,
            background: accent,
            boxShadow: `0 0 24px ${accent}60`,
          }}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={() => onNext?.(isShuffle)}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={cycleRepeat}
          className="p-2 relative transition-colors"
          style={{ color: repeat !== REPEAT.OFF ? accent : "rgba(255,255,255,0.25)" }}
          title={`Repeat: ${repeat}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
          {/* "1" badge for repeat one */}
          {repeat === REPEAT.ONE && (
            <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: accent, color: "#000" }}>
              1
            </span>
          )}
        </button>
      </div>

      {/* ── Volume ── */}
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0"
        >
          {isMuted || volume === 0 ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>

        <div
          className="flex-1 relative h-0.5 bg-white/[0.07] rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(Math.round(pct * 100));
            setIsMuted(false);
          }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${isMuted ? 0 : volume}%`, background: "rgba(255,255,255,0.25)" }}
          />
          <div
            className="absolute top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white transition-opacity"
            style={{ left: `${isMuted ? 0 : volume}%`, transform: "translate(-50%, -50%)" }}
          />
        </div>

        <span className="text-[10px] text-white/20 w-6 text-right flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
          {isMuted ? 0 : volume}
        </span>
      </div>

    </div>
  );
};

export default Player;
