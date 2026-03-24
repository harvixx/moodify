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
  const { theme, changeTheme, THEMES } = useTheme(); // ✅ global theme

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setView("main");
      }
    };
    const t = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", handler); };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logoutUser(); } catch {}
    setUser(null);
    navigate("/login");
  };

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">

      {/* Avatar */}
      <button
        onClick={() => { setOpen(p => !p); setView("main"); }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
        style={{
          background:  open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
          border:      `1.5px solid ${open ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)"}`,
          color:       open ? "#fff" : "rgba(255,255,255,0.6)",
        }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 rounded-2xl overflow-hidden"
          style={{
            top: 45, width: 220,
            background: "#1c1c1c",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
            zIndex: 99999,
          }}
        >

          {/* MAIN */}
          {view === "main" && (
            <>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                  {user?.name || "User"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {user?.email || ""}
                </p>
              </div>

              <div style={{ padding: "6px 0" }}>
                <Item
                  icon="🎨" label="Theme"
                  right={
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.dot }} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                        {theme.label}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>›</span>
                    </div>
                  }
                  onClick={() => setView("themes")}
                />
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 12px" }} />
                <Item icon="📊" label="Mood History" sub="Coming soon" disabled />
                <Item icon="⚙️" label="Settings"     sub="Coming soon" disabled />
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 12px" }} />
                <Item
                  icon={loggingOut ? "⏳" : "🚪"}
                  label={loggingOut ? "Logging out..." : "Logout"}
                  danger disabled={loggingOut}
                  onClick={handleLogout}
                />
              </div>
            </>
          )}

          {/* THEMES */}
          {view === "themes" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <button
                  onClick={() => setView("main")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 20, padding: "0 4px" }}
                >‹</button>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Choose Theme</span>
              </div>
              <div style={{ padding: "6px 0" }}>
                {THEMES.map((t) => {
                  const isActive = t.id === theme.id;
                  return (
                    <button key={t.id} onClick={() => { changeTheme(t); setView("main"); setOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                        padding: "9px 16px",
                        background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, background: t.bg, flexShrink: 0,
                        border: `1.5px solid ${isActive ? t.dot : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.dot }} />
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: isActive ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: isActive ? 600 : 400 }}>
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

const Item = ({ icon, label, sub, right, onClick, danger, disabled }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 16px",
        background: hovered && !disabled ? (danger ? "rgba(255,80,80,0.08)" : "rgba(255,255,255,0.05)") : "transparent",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1, textAlign: "left", transition: "background 0.15s",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: danger ? "#ff6b6b" : "rgba(255,255,255,0.75)" }}>{label}</p>
        {sub && <p style={{ margin: "1px 0 0", fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{sub}</p>}
      </div>
      {right}
    </button>
  );
};

export default ProfileMenu;