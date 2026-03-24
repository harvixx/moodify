// src/features/home/components/CategoryBar.jsx
import { useEffect, useState } from "react";
import { getCategories } from "../../songs/services/song.api";

const DEFAULT_CATEGORIES = [
  { id: "bollywood",  label: "Bollywood",    emoji: "🎬" },
  { id: "lofi",       label: "Lo-Fi",        emoji: "🎧" },
  { id: "punjabi",    label: "Punjabi",       emoji: "🥁" },
  { id: "rap",        label: "Rap",          emoji: "🎤" },
  { id: "romantic",   label: "Romantic",     emoji: "❤️" },
  { id: "devotional", label: "Devotional",   emoji: "🙏" },
  { id: "folk",       label: "Folk",         emoji: "🪘" },
  { id: "retro",      label: "Retro",        emoji: "📻" },
  { id: "indie",      label: "Indie",        emoji: "🎸" },
  { id: "workout",    label: "Workout",      emoji: "💪" },
];

const CategoryBar = ({ activeCategory, onSelect }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading]       = useState(false);

  // Backend se categories fetch karo
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategories();
        if (data?.categories?.length) setCategories(data.categories);
      } catch {
        // Default use karo
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto"
      style={{ scrollbarWidth: "none" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all duration-200 border"
            style={{
              background:  isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.06)",
              color:       isActive ? "rgba(255,255,255,0.9)"  : "rgba(255,255,255,0.35)",
              transform:   isActive ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span className="text-sm">{cat.emoji}</span>
            <span style={{ fontFamily: "'DM Mono', monospace" }}>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryBar;
