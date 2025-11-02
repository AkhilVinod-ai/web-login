import React, { useEffect, useRef, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

export default function App() {
  const cyberRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = cyberRef.current;
    function handleMove(e) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${(x - 0.5) * 40}px`);
      el.style.setProperty("--my", `${(y - 0.5) * 20}px`);
    }
    function handleClick(e) {
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
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
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
      const res = await fetch("https://api.quotable.io/random?tags=technology|science|innovation");
      const data = await res.json();
      setQuote(data);
    } catch {
      setQuote({ content: "Push your limits — and your code — to the cloud.", author: "CS642" });
    } finally {
      setLoadingQuote(false);
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Left: Centered Auth Box */}
      <div className="left-side">
        <div className="auth-card">
          <div className="card-head">
            <div
              className={`status-dot ${online ? "online" : "offline"}`}
              title={online ? "Online" : "Offline"}
            />
            <h1 className="welcome-title">Welcome</h1>
          </div>

          <p className="course-info">CS 642/442 — Cloud Computing Portal</p>

          {/* Centered form container */}
          <div className="form-wrapper">
            <Authenticator />
          </div>

          <div className="interactive-row">
            <button className="mini-btn" onClick={fetchQuote} disabled={loadingQuote}>
              {loadingQuote ? "Loading..." : "Get Cloud Tip"}
            </button>
            <div className="clock">{time}</div>
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

      {/* Right: Cyber Grid */}
      <div className="right-side">
        <div className="cyber-bg" ref={cyberRef}>
          <div className="nebula" />
          <div className="grid" />
          
          {/* Instruction text */}
          <div className="click-hint">
            Try clicking anywhere on the grid
          </div>
          
          <div className="glow" />
        </div>
      </div>
    </div>
  );
}
