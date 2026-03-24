// src/features/home/components/SearchBar.jsx
import { useState, useRef } from "react";
import { useTheme } from "../context/Theme.context";

const SearchBar = ({ onSearch, activeQuery }) => {
  const { isWhite } = useTheme();
  const [value, setValue]     = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef              = useRef(null);

  // Theme-aware colors
  const bgNormal   = isWhite ? "rgba(0,0,0,0.04)"  : "rgba(255,255,255,0.03)";
  const bgFocused  = isWhite ? "rgba(0,0,0,0.07)"  : "rgba(255,255,255,0.06)";
  const bdNormal   = isWhite ? "rgba(0,0,0,0.08)"  : "rgba(255,255,255,0.06)";
  const bdFocused  = isWhite ? "rgba(0,0,0,0.15)"  : "rgba(255,255,255,0.12)";
  const iconColor  = focused  ? (isWhite ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)")
                              : (isWhite ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)");
  const inputText  = isWhite ? "rgba(0,0,0,0.8)"   : "rgba(255,255,255,0.8)";
  const placeholder = isWhite ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)";
  const clearColor = isWhite ? "rgba(0,0,0,0.2)"   : "rgba(255,255,255,0.2)";
  const clearHover = isWhite ? "rgba(0,0,0,0.5)"   : "rgba(255,255,255,0.5)";
  const subText    = isWhite ? "rgba(0,0,0,0.2)"   : "rgba(255,255,255,0.2)";
  const subTextBold = isWhite ? "rgba(0,0,0,0.4)"  : "rgba(255,255,255,0.4)";
  const submitBg   = value.trim() ? (isWhite ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.1)") : "transparent";
  const submitText = isWhite ? "rgba(0,0,0,0.5)"   : "rgba(255,255,255,0.5)";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 border transition-all duration-200"
        style={{
          background:  focused ? bgFocused  : bgNormal,
          borderColor: focused ? bdFocused  : bdNormal,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="flex-shrink-0 transition-colors">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search songs, artists..."
          className="flex-1 py-2.5 bg-transparent focus:outline-none"
          style={{ color: inputText, fontSize: 13, fontFamily: "'DM Mono', monospace" }}
        />

        <style>{`input::placeholder { color: ${placeholder}; }`}</style>

        {(value || activeQuery) && (
          <button type="button" onClick={handleClear}
            className="flex-shrink-0 p-1 transition-colors"
            style={{ color: clearColor, background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.color = clearHover}
            onMouseLeave={e => e.currentTarget.style.color = clearColor}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}

        <button type="submit" disabled={!value.trim()}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-0"
          style={{ background: submitBg, color: submitText, fontFamily: "'DM Mono', monospace", border: "none", cursor: "pointer" }}>
          Search
        </button>
      </div>

      {activeQuery && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="text-[10px]" style={{ color: subText, fontFamily: "'DM Mono', monospace" }}>Showing results for</span>
          <span className="text-[10px] font-medium" style={{ color: subTextBold, fontFamily: "'DM Mono', monospace" }}>"{activeQuery}"</span>
          <button type="button" onClick={handleClear}
            className="text-[10px] ml-auto transition-colors"
            style={{ color: subText, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}
            onMouseEnter={e => e.currentTarget.style.color = subTextBold}
            onMouseLeave={e => e.currentTarget.style.color = subText}>
            clear ×
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchBar;