// src/features/home/components/MoodDisplay.jsx
import { useTheme } from "../context/Theme.context";

const EMOTION_CONFIG = {
  happy:   { emoji: "😊", label: "Happy",   desc: "Energetic vibes",   accent: "#FFD60A", glow: "rgba(255,214,10,0.15)"  },
  sad:     { emoji: "😢", label: "Sad",     desc: "Emotional depth",   accent: "#6B8CFF", glow: "rgba(107,140,255,0.15)" },
  angry:   { emoji: "😠", label: "Angry",   desc: "Aggressive energy", accent: "#FF453A", glow: "rgba(255,69,58,0.15)"   },
  neutral: { emoji: "😐", label: "Neutral", desc: "Chill state",       accent: "#BF5AF2", glow: "rgba(191,90,242,0.15)"  },
  relaxed: { emoji: "😌", label: "Relaxed", desc: "Calm & grounded",   accent: "#30D158", glow: "rgba(48,209,88,0.15)"   },
};

const MoodDisplay = ({ emotion }) => {
  const { isWhite } = useTheme();
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;

  const cardBorder = isWhite ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const labelText  = isWhite ? "#374151"           : "rgba(255,255,255,0.9)";
  const subText    = isWhite ? "#6b7280"            : "rgba(255,255,255,0.3)";
  const trackBg   = isWhite ? "rgba(0,0,0,0.06)"   : "rgba(255,255,255,0.06)";

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden transition-all duration-700"
      style={{
        background: `radial-gradient(circle at 30% 50%, ${config.glow}, ${isWhite ? "#ffffff" : "transparent"} 70%)`,
        border: `1px solid ${cardBorder}`,
      }}
    >
      {/* Accent line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}66, transparent)` }}
      />

      <div className="flex items-center gap-4">
        {/* Emoji */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `${config.accent}18`, border: `1px solid ${cardBorder}` }}
        >
          {config.emoji}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: `${config.accent}99`, fontFamily: "'DM Mono', monospace" }}>
            Current Mood
          </p>
          <p className="text-xl font-bold tracking-tight" style={{ color: labelText }}>
            {config.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: `${config.accent}88` }}>
            {config.desc}
          </p>
        </div>

        {/* Match % */}
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold" style={{ color: config.accent, fontFamily: "'DM Mono', monospace" }}>
            99<span className="text-sm">%</span>
          </p>
          <p className="text-[10px]" style={{ color: subText, fontFamily: "'DM Mono', monospace" }}>match</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-0.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: "99%", background: `linear-gradient(90deg, ${config.accent}44, ${config.accent})` }}
        />
      </div>
    </div>
  );
};

export default MoodDisplay;