// src/features/home/components/MoodDisplay.jsx

const EMOTION_CONFIG = {
  happy:   { emoji: "😊", label: "Happy",   desc: "Energetic vibes",    accent: "#FFD60A", glow: "rgba(255,214,10,0.15)"  },
  sad:     { emoji: "😢", label: "Sad",     desc: "Emotional depth",    accent: "#6B8CFF", glow: "rgba(107,140,255,0.15)" },
  angry:   { emoji: "😠", label: "Angry",   desc: "Aggressive energy",  accent: "#FF453A", glow: "rgba(255,69,58,0.15)"   },
  neutral: { emoji: "😐", label: "Neutral", desc: "Chill state",        accent: "#BF5AF2", glow: "rgba(191,90,242,0.15)"  },
  relaxed: { emoji: "😌", label: "Relaxed", desc: "Calm & grounded",    accent: "#30D158", glow: "rgba(48,209,88,0.15)"   },
};

const MoodDisplay = ({ emotion }) => {
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;

  return (
    <div
      className="rounded-2xl border border-white/[0.08] p-4 relative overflow-hidden transition-all duration-700"
      style={{ background: `radial-gradient(circle at 30% 50%, ${config.glow}, transparent 70%)` }}
    >
      {/* Accent line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}66, transparent)` }}
      />

      <div className="flex items-center gap-4">
        {/* Big emoji */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/[0.08]"
          style={{ background: `${config.accent}18` }}
        >
          {config.emoji}
        </div>

        <div>
          <p className="text-[10px] font-['DM_Mono',monospace] uppercase tracking-widest mb-1"
            style={{ color: `${config.accent}99` }}>
            Current Mood
          </p>
          <p className="text-xl font-bold text-white tracking-tight">{config.label}</p>
          <p className="text-xs mt-0.5" style={{ color: `${config.accent}88` }}>{config.desc}</p>
        </div>

        {/* Match % — decorative */}
        <div className="ml-auto text-right">
          <p className="text-2xl font-['DM_Mono',monospace] font-bold" style={{ color: config.accent }}>
            99<span className="text-sm">%</span>
          </p>
          <p className="text-[10px] text-white/30 font-['DM_Mono',monospace]">match</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: "99%", background: `linear-gradient(90deg, ${config.accent}44, ${config.accent})` }}
        />
      </div>
    </div>
  );
};

export default MoodDisplay;
