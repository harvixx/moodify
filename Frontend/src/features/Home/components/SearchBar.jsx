// src/features/home/components/SearchBar.jsx
import { useState, useRef } from "react";

// ─────────────────────────────────────────────
// SearchBar
// Props:
//   onSearch     → fn(query) — YouTube search
//   activeQuery  → current search query string
// ─────────────────────────────────────────────
const SearchBar = ({ onSearch, activeQuery }) => {
  const [value, setValue]   = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef            = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
    onSearch(""); // clear search
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 border transition-all duration-200"
        style={{
          background:  focused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          borderColor: focused ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
        }}
      >
        {/* Search icon */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={focused ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="flex-shrink-0 transition-colors"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search songs, artists..."
          className="flex-1 py-2.5 bg-transparent text-sm text-white/80 placeholder-white/20 focus:outline-none"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}
        />

        {/* Clear button */}
        {(value || activeQuery) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 p-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-0"
          style={{
            background: value.trim() ? "rgba(255,255,255,0.1)" : "transparent",
            color:      "rgba(255,255,255,0.5)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Search
        </button>
      </div>

      {/* Active search indicator */}
      {activeQuery && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="text-[10px] text-white/20" style={{ fontFamily: "'DM Mono', monospace" }}>
            Showing results for
          </span>
          <span className="text-[10px] text-white/40 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
            "{activeQuery}"
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-white/20 hover:text-white/50 transition-colors ml-auto"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            clear ×
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
