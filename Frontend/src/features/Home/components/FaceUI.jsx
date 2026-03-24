// src/features/home/components/FaceUI.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { initFaceDetector, startDetection, stopDetection } from "../../Expression/utils/faceDetection";
import { getSongs } from "../../songs/services/song.api";
import { useTheme } from "../context/Theme.context";

const EMOTION_CONFIG = {
  happy:   { emoji: "😊", label: "Happy",   color: "#FFD60A" },
  sad:     { emoji: "😢", label: "Sad",     color: "#6B8CFF" },
  angry:   { emoji: "😠", label: "Angry",   color: "#FF453A" },
  neutral: { emoji: "😐", label: "Neutral", color: "#BF5AF2" },
  relaxed: { emoji: "😌", label: "Relaxed", color: "#30D158" },
};

const FaceUI = ({ onSongsLoaded }) => {
  const { isWhite } = useTheme();
  const videoRef = useRef(null);

  const [status, setStatus]           = useState("idle");
  const [emotionData, setEmotionData] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => { initFaceDetector(); }, []);

  const handleEmotion = useCallback((data) => setEmotionData(data), []);

  const handleStart = async () => {
    setStatus("loading");
    setCameraError("");
    try {
      await startDetection(videoRef, handleEmotion);
      setStatus("detecting");
    } catch {
      setCameraError("Camera access denied.");
      setStatus("error");
    }
  };

  const handleStop = () => {
    stopDetection(videoRef);
    setStatus("stopped");
    setEmotionData(null);
    setFetchStatus("idle");
  };

  const handleFetchSongs = async () => {
    if (!emotionData?.dominant) return;
    setFetchStatus("fetching");
    try {
      const response = await getSongs({ emotion: emotionData.dominant, topTwo: emotionData.topTwo });
      setFetchStatus("done");
      if (onSongsLoaded) onSongsLoaded(response.songs, emotionData.dominant, response.query, response.nextPageToken);
    } catch {
      setFetchStatus("error");
    }
  };

  const isDetecting  = status === "detecting";
  const isLoading    = status === "loading";
  const dominantConf = emotionData ? EMOTION_CONFIG[emotionData.dominant] : null;

  // Theme-aware colors
  const overlayBg   = isWhite ? "rgba(255,255,255,0.92)" : "rgba(10,10,10,0.90)";
  const overlayText = isWhite ? "rgba(0,0,0,0.3)"        : "rgba(255,255,255,0.2)";
  const camBorder   = isWhite ? "rgba(0,0,0,0.08)"       : "rgba(255,255,255,0.06)";
  const camBg       = isWhite ? "#f3f4f6"                 : "#111";
  const btnBorder   = isWhite ? "rgba(0,0,0,0.1)"         : "rgba(255,255,255,0.08)";
  const btnBg       = isWhite ? "rgba(0,0,0,0.04)"        : "rgba(255,255,255,0.05)";
  const btnText     = isWhite ? "rgba(0,0,0,0.6)"         : "rgba(255,255,255,0.7)";
  const scoreLabelC = isWhite ? "rgba(0,0,0,0.2)"         : "rgba(255,255,255,0.2)";
  const scoreTrack  = isWhite ? "rgba(0,0,0,0.06)"        : "rgba(255,255,255,0.06)";

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Camera Box */}
      <div
        className="relative rounded-2xl overflow-hidden aspect-video w-full"
        style={{ background: camBg, border: `1px solid ${camBorder}` }}
      >
        <video ref={videoRef} autoPlay playsInline muted
          className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />

        {/* Overlays */}
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: overlayBg }}>
            <span className="text-4xl opacity-25">📷</span>
            <p className="text-xs" style={{ color: overlayText }}>Camera off</p>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: overlayBg }}>
            <div className="w-6 h-6 border-2 border-t-current rounded-full animate-spin" style={{ borderColor: `${overlayText}`, borderTopColor: isWhite ? "#000" : "#fff" }} />
            <p className="text-xs" style={{ color: overlayText }}>Starting...</p>
          </div>
        )}
        {status === "stopped" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: overlayBg }}>
            <span className="text-4xl opacity-25">⏹</span>
            <p className="text-xs" style={{ color: overlayText }}>Stopped</p>
          </div>
        )}

        {/* LIVE badge */}
        {isDetecting && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-white" style={{ fontFamily: "'DM Mono', monospace" }}>LIVE</span>
          </div>
        )}

        {/* Emotion badge */}
        {isDetecting && dominantConf && (
          <div
            className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm border"
            style={{ background: `${dominantConf.color}18`, borderColor: `${dominantConf.color}40` }}
          >
            <span className="text-sm">{dominantConf.emoji}</span>
            <span className="text-xs font-semibold" style={{ color: dominantConf.color, fontFamily: "'DM Mono', monospace" }}>
              {dominantConf.label}
            </span>
          </div>
        )}
      </div>

      {/* Camera error */}
      {cameraError && <p className="text-xs text-red-400/70 text-center">{cameraError}</p>}

      {/* Start / Stop */}
      {isDetecting ? (
        <button onClick={handleStop}
          className="w-full py-2.5 rounded-xl border text-sm font-semibold transition-all"
          style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
          ⏹ Stop
        </button>
      ) : (
        <button onClick={handleStart} disabled={isLoading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{ border: `1px solid ${btnBorder}`, background: btnBg, color: btnText }}>
          {isLoading ? "Starting..." : "📷 Start Detection"}
        </button>
      )}

      {/* Emotion card */}
      {isDetecting && emotionData && dominantConf && (
        <div
          className="rounded-2xl border p-4 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${dominantConf.color}10, transparent 60%)`,
            borderColor: `${dominantConf.color}20`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
              style={{ background: `${dominantConf.color}12`, borderColor: `${dominantConf.color}20` }}>
              {dominantConf.emoji}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-0.5"
                style={{ color: `${dominantConf.color}70`, fontFamily: "'DM Mono', monospace" }}>
                Detected
              </p>
              <p className="text-base font-bold" style={{ color: isWhite ? "#111" : "#fff" }}>
                {dominantConf.label}
              </p>
            </div>
          </div>

          {/* Score bars */}
          <div className="space-y-2 mb-4">
            {Object.entries(emotionData.allScores)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, score]) => {
                const c       = EMOTION_CONFIG[emotion];
                const percent = Math.min(Math.round(score * 100), 100);
                const isTop   = emotion === emotionData.dominant;
                return (
                  <div key={emotion} className="flex items-center gap-2">
                    <span className="text-xs w-4">{c.emoji}</span>
                    <span className="text-[10px] w-12 capitalize"
                      style={{ color: isTop ? c.color : scoreLabelC, fontFamily: "'DM Mono', monospace" }}>
                      {emotion}
                    </span>
                    <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: scoreTrack }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, background: isTop ? c.color : `${c.color}40` }} />
                    </div>
                    <span className="text-[10px] w-6 text-right"
                      style={{ color: isTop ? c.color : scoreLabelC, fontFamily: "'DM Mono', monospace" }}>
                      {percent}%
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Get Songs button */}
          <button
            onClick={handleFetchSongs}
            disabled={fetchStatus === "fetching"}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${dominantConf.color}cc, ${dominantConf.color})`,
              color: "#000",
              boxShadow: `0 4px 16px ${dominantConf.color}40`,
            }}
          >
            {fetchStatus === "fetching" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" />
                Loading songs...
              </span>
            ) : fetchStatus === "done" ? "✓ Playlist loaded · Refresh"
              : `🎵 Get ${dominantConf.label} Songs`}
          </button>

          {fetchStatus === "error" && (
            <p className="text-[11px] text-red-400/60 text-center mt-2">Failed · Check connection</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceUI;