import React, { useEffect, useRef, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

export default function App() {
  const cyberRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    function handleMove(e) {
      const el = cyberRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      // set CSS vars for subtle parallax
      el.style.setProperty("--mx", `${(x - 0.5) * 40}px`);
      el.style.setProperty("--my", `${(y - 0.5) * 20}px`);
    }

    function handleClick(e) {
      const el = cyberRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const pulse = document.createElement("div");
      pulse.className = "click-pulse";
      pulse.style.left = px + "px";
      pulse.style.top = py + "px";
      el.appendChild(pulse);
      setTimeout(() => pulse.remove(), 1200);
    }

    function onOnline() { setOnline(true); }
    function onOffline() { setOnline(false); }

    const el = cyberRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMove);
      el.addEventListener("click", handleClick);
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("click", handleClick);
      }
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function fetchQuote() {
    setLoadingQuote(true);
    try {
      const res = await fetch("https://api.quotable.io/random?tags=technology|science");
      if (!res.ok) throw new Error("Quote fetch failed");
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      setQuote({ content: "Keep pushing code to the cloud.", author: "CS Tip" });
    } finally {
      setLoadingQuote(false);
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Left side: welcome + auth form */}
      <div className="left-side">
        <div className="auth-card">
          <div className="card-head">
            <div className={`status-dot ${online ? "online" : "offline"}`} title={online ? "Online" : "Offline"} />
            <h1 className="welcome-title">Welcome</h1>
          </div>

          <p className="course-info">CS 642/442 — Cloud Computing</p>

          <div className="amplify-box">
            <Authenticator />
          </div>

          <div className="interactive-row">
            <button className="mini-btn" onClick={fetchQuote} disabled={loadingQuote}>
              {loadingQuote ? "Fetching tip..." : "Get Cloud Tip"}
            </button>
            <div className="clock">{new Date().toLocaleTimeString()}</div>
          </div>

          {quote && (
            <div className="quote-box">
              <p className="quote">“{quote.content}”</p>
              <p className="quote-author">— {quote.author}</p>
            </div>
          )}

          <p className="university">University of Nevada, Reno</p>
        </div>
      </div>

      {/* Right side: cyber background */}
      <div className="right-side">
        <div className="cyber-bg" ref={cyberRef}>
          <div className="grid"></div>
          <div className="mountain"></div>
          <div className="glow"></div>
        </div>
      </div>
    </div>
  );
}
