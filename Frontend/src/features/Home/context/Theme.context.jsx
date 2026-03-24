// src/context/Theme.context.jsx
import { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────
// All themes — single source of truth
// ─────────────────────────────────────────────
export const THEMES = [
  { id: "black",    label: "Pure Black", bg: "#000000", dot: "#ffffff", accent: "#ffffff", isLight: false },
  { id: "dark",     label: "Dark Grey",  bg: "#0a0a0a", dot: "#ffffff", accent: "#ffffff", isLight: false },
  { id: "white",    label: "Pure White", bg: "#ffffff", dot: "#000000", accent: "#6366f1", isLight: true  },
  { id: "midnight", label: "Midnight",   bg: "#0d0d1a", dot: "#6366f1", accent: "#6366f1", isLight: false },
  { id: "forest",   label: "Forest",     bg: "#0a120a", dot: "#30D158", accent: "#30D158", isLight: false },
  { id: "rose",     label: "Rose",       bg: "#120a0a", dot: "#FF453A", accent: "#FF453A", isLight: false },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // ✅ localStorage se saved theme lo
    const saved = localStorage.getItem("moodify-theme");
    return THEMES.find(t => t.id === saved) || THEMES[0];
  });

  // ✅ Theme change hone par CSS variables update karo + save karo
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-bg",      theme.bg);
    root.style.setProperty("--app-accent",  theme.accent);
    root.style.setProperty("--app-dot",     theme.dot);
    root.style.setProperty("--app-text",    theme.isLight ? "#111111" : "#ffffff");
    root.style.setProperty("--app-subtext", theme.isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)");
    root.style.setProperty("--app-border",  theme.isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)");
    root.style.setProperty("--app-surface", theme.isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)");
    root.style.setProperty("--app-card",    theme.isLight ? "#f8f8f8" : "#141414");

    // document body background bhi update karo
    document.body.style.background = theme.bg;

    localStorage.setItem("moodify-theme", theme.id);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (typeof newTheme === "string") {
      const found = THEMES.find(t => t.id === newTheme);
      if (found) setTheme(found);
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, THEMES, isLight: theme.isLight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
