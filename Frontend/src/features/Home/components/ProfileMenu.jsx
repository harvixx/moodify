// src/features/home/components/ProfileMenu.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/Auth.context";
import { useTheme } from "../context/Theme.context";
import { logoutUser } from "../../auth/services/auth.api";

const ProfileMenu = () => {
  const [open, setOpen]             = useState(false);
  const [view, setView]             = useState("main");
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapRef                     = useRef(null);
  const navigate                    = useNavigate();
  const { user, setUser }           = useAuth();
  const { theme, changeTheme, THEMES, isWhite } = useTheme();

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  // ── Theme-aware colors ──
  // Avatar
  const avatarBg        = open
    ? (isWhite ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)")
    : (isWhite ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)");
  const avatarBorder    = open
    ? (isWhite ? "rgba(0,0,0,0.25)"  : "rgba(255,255,255,0.3)")
    : (isWhite ? "rgba(0,0,0,0.12)"  : "rgba(255,255,255,0.12)");
  const avatarColor     = open
    ? (isWhite ? "#111"  : "#fff")
    : (isWhite ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)");

  // Dropdown
  const dropBg          = isWhite ? "#ffffff"                  : "#1c1c1c";
  const dropBorder      = isWhite ? "rgba(0,0,0,0.1)"          : "rgba(255,255,255,0.1)";
  const dropShadow      = isWhite
    ? "0 16px 48px rgba(0,0,0,0.12)"
    : "0 16px 48px rgba(0,0,0,0.8)";
  const dividerColor    = isWhite ? "rgba(0,0,0,0.07)"         : "rgba(255,255,255,0.06)";
  const userNameColor   = isWhite ? "rgba(0,0,0,0.8)"          : "rgba(255,255,255,0.8)";
  const userEmailColor  = isWhite ? "rgba(0,0,0,0.35)"         : "rgba(255,255,255,0.3)";
  const themeDotLabel   = isWhite ? "rgba(0,0,0,0.35)"         : "rgba(255,255,255,0.3)";
  const themeArrow      = isWhite ? "rgba(0,0,0,0.2)"          : "rgba(255,255,255,0.25)";
  const sectionHead     = isWhite ? "rgba(0,0,0,0.6)"          : "rgba(255,255,255,0.6)";
  const backBtnColor    = isWhite ? "rgba(0,0,0,0.35)"         : "rgba(255,255,255,0.4)";
  const backBtnHover    = isWhite ? "rgba(0,0,0,0.65)"         : "rgba(255,255,255,0.7)";
  const itemLabelColor  = isWhite ? "rgba(0,0,0,0.75)"         : "rgba(255,255,255,0.75)";
  const itemSubColor    = isWhite ? "rgba(0,0,0,0.3)"          : "rgba(255,255,255,0.25)";
  const itemHoverBg     = isWhite ? "rgba(0,0,0,0.04)"         : "rgba(255,255,255,0.05)";
  const swatchBorder    = isWhite ? "rgba(0,0,0,0.1)"          : "rgba(255,255,255,0.1)";
  const inactiveName    = isWhite ? "rgba(0,0,0,0.45)"         : "rgba(255,255,255,0.5)";
  const activeName      = isWhite ? "#111"                     : "#fff";
  const themeHoverBg    = isWhite ? "rgba(0,0,0,0.03)"         : "rgba(255,255,255,0.04)";
  const activeItemBg    = isWhite ? "rgba(0,0,0,0.05)"         : "rgba(255,255,255,0.07)";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setView("main");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const pickTheme = (selectedTheme) => {
    changeTheme(selectedTheme);
    setView("main");
  };

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">

      {/* ── Avatar button — theme aware ── */}
      <button
        onClick={() => { setOpen(p => !p); setView("main"); }}
        aria-haspopup="true"
        aria-expanded={open}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
        style={{
          background:  avatarBg,
          border:      `1.5px solid ${avatarBorder}`,
          color:       avatarColor,
        }}
      >
        {initial}
      </button>

      {/* ── Dropdown — theme aware ── */}
      {open && (
        <div
          className="absolute right-0 rounded-2xl overflow-hidden"
          style={{
            top: 45, width: 224,
            background:  dropBg,
            border:      `1px solid ${dropBorder}`,
            boxShadow:   dropShadow,
            zIndex:      99999,
          }}
        >

          {/* ════ MAIN ════ */}
          {view === "main" && (
            <>
              {/* User info */}
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${dividerColor}` }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: userNameColor }}>
                  {user?.name || "User"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: userEmailColor, fontFamily: "monospace" }}>
                  {user?.email || ""}
                </p>
              </div>

              <div style={{ padding: "6px 0" }}>

                {/* Theme */}
                <Item
                  icon="🎨" label="Theme"
                  labelColor={itemLabelColor}
                  hoverBg={itemHoverBg}
                  right={
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.dot }} />
                      <span style={{ fontSize: 10, color: themeDotLabel, fontFamily: "monospace" }}>
                        {theme.label}
                      </span>
                      <span style={{ color: themeArrow, fontSize: 14, lineHeight: 1 }}>›</span>
                    </div>
                  }
                  onClick={() => setView("themes")}
                />

                <hr style={{ border: "none", borderTop: `1px solid ${dividerColor}`, margin: "4px 12px" }} />

                <Item icon="📊" label="Mood History" sub="Coming soon" labelColor={itemLabelColor} subColor={itemSubColor} hoverBg={itemHoverBg} disabled />
                <Item icon="⚙️" label="Settings"     sub="Coming soon" labelColor={itemLabelColor} subColor={itemSubColor} hoverBg={itemHoverBg} disabled />

                <hr style={{ border: "none", borderTop: `1px solid ${dividerColor}`, margin: "4px 12px" }} />

                <Item
                  icon={loggingOut ? "⏳" : "🚪"}
                  label={loggingOut ? "Logging out..." : "Logout"}
                  labelColor={itemLabelColor}
                  hoverBg={itemHoverBg}
                  danger disabled={loggingOut}
                  onClick={handleLogout}
                />
              </div>
            </>
          )}

          {/* ════ THEMES ════ */}
          {view === "themes" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderBottom: `1px solid ${dividerColor}` }}>
                <button
                  onClick={() => setView("main")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: backBtnColor, fontSize: 20, lineHeight: 1, padding: "0 4px", borderRadius: 6 }}
                  onMouseEnter={e => e.target.style.color = backBtnHover}
                  onMouseLeave={e => e.target.style.color = backBtnColor}
                >‹</button>
                <span style={{ fontSize: 13, fontWeight: 600, color: sectionHead }}>Choose Theme</span>
              </div>

              <div style={{ padding: "6px 0" }}>
                {THEMES.map(t => {
                  const isActive = t.id === theme.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => pickTheme(t)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                        padding: "9px 16px",
                        background: isActive ? activeItemBg : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = themeHoverBg; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      {/* Swatch */}
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: t.bg,
                        border: `1.5px solid ${isActive ? t.dot : swatchBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: isActive ? `0 0 10px ${t.dot}40` : "none",
                        transition: "all 0.2s",
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.dot }} />
                      </div>

                      <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? activeName : inactiveName }}>
                        {t.label}
                      </span>

                      {isActive && <span style={{ fontSize: 13, fontWeight: 700, color: t.dot }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

// ── Reusable row ──
const Item = ({ icon, label, sub, right, onClick, danger, disabled, labelColor, subColor, hoverBg }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 16px",
        background: isHovered && !disabled
          ? (danger ? "rgba(255,80,80,0.08)" : (hoverBg || "rgba(255,255,255,0.05)"))
          : "transparent",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1, textAlign: "left", transition: "background 0.15s",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: danger ? "#ff6b6b" : (labelColor || "rgba(255,255,255,0.75)") }}>
          {label}
        </p>
        {sub && (
          <p style={{ margin: "1px 0 0", fontSize: 10, color: subColor || "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
            {sub}
          </p>
        )}
      </div>
      {right && right}
    </button>
  );
};

export default ProfileMenu;