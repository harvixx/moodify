// src/context/Theme.context.jsx
import { createContext, useContext, useState, useEffect } from "react";

// ✅ Same THEMES jo ProfileMenu mein hain — ek jagah define
export const THEMES = [
  { id: "black",    label: "Pure Black", bg: "#000000", dot: "#ffffff", accent: "#ffffff" },
  { id: "dark",     label: "Dark Grey",  bg: "#0a0a0a", dot: "#ffffff", accent: "#ffffff" },
  { id: "white",    label: "Pure White", bg: "#ffffff", dot: "#000000", accent: "#6366f1" },
  { id: "midnight", label: "Midnight",   bg: "#0d0d1a", dot: "#6366f1", accent: "#6366f1" },
  { id: "forest",   label: "Forest",     bg: "#0a120a", dot: "#30D158", accent: "#30D158" },
  { id: "rose",     label: "Rose",       bg: "#120a0a", dot: "#FF453A", accent: "#FF453A" },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    // App load hone par localStorage se saved theme lo
    try {
      const savedId = localStorage.getItem("moodify_theme");
      const found   = THEMES.find(t => t.id === savedId);
      return found || THEMES[0]; // default: black
    } catch {
      return THEMES[0];
    }
  });

  // Theme change hone par:
  // 1. localStorage mein save karo
  // 2. document.body background update karo
  useEffect(() => {
    try { localStorage.setItem("moodify_theme", theme.id); } catch {}
    document.body.style.background  = theme.bg;
    document.body.style.transition  = "background 0.4s ease";
  }, [theme]);

  // ID ya object dono accept karta hai
  const changeTheme = (input) => {
    if (typeof input === "string") {
      const found = THEMES.find(t => t.id === input);
      if (found) setTheme(found);
    } else if (input?.id) {
      setTheme(input);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,          // { id, label, bg, dot, accent }
      changeTheme,    // changeTheme("dark") ya changeTheme(themeObject)
      isWhite: theme.id === "white",
      THEMES,         // poori list — ProfileMenu mein use hogi
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);