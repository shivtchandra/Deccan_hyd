"use client";

import { useState, useRef, useEffect } from "react";
import { eraLabel, eraColor } from "../../lib/heritage.js";
import { Icon } from "./Icons.jsx";

export default function PostcardModal({ site, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!site) return null;

  const photo = site.id === "charminar"
    ? "/charminar-field-note.png"
    : site.photos?.[0]?.url || "/photos/charminar.jpg";

  const yearBuilt = site.startYear || site.yearBuilt || (site.era === "qutb-shahi" ? "1591" : "18th C.");
  const coords = site.lat && site.lng ? `${site.lat.toFixed(4)}°N, ${site.lng.toFixed(4)}°E` : "17.3616°N, 78.4747°E";
  
  // Prefer clean production domain
  const baseUrl = typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin
    : "https://heritage.mapmyhyd.com";
  const shareUrl = `${baseUrl}/?site=${site.id}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${site.name} — Deccan Heritage Map`,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadPostcard = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");

      // 1. Paper Background
      ctx.fillStyle = "#F8F4EC";
      ctx.fillRect(0, 0, 1200, 1600);

      // Subtle texture grain & border
      ctx.strokeStyle = "#D4C7B4";
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 1128, 1528);

      ctx.strokeStyle = "#A34726";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(46, 46, 1108, 1508);

      // 2. Postcard Header Banner
      ctx.fillStyle = "#2B2119";
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "6px";
      ctx.fillText("DECCAN HERITAGE ATLAS", 600, 100);

      ctx.fillStyle = "#8B4B32";
      ctx.font = "italic 18px Georgia, serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("HYDERABAD HISTORICAL ARCHIVE", 600, 130);

      // 3. Vintage Postmark Stamp (Top Right)
      ctx.save();
      ctx.translate(1030, 130);
      ctx.strokeStyle = "#8B4B32";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#8B4B32";
      ctx.textAlign = "center";
      ctx.fillText("DECCAN", 0, -16);
      ctx.fillText(String(yearBuilt), 0, 4);
      ctx.fillText("POSTAGE", 0, 24);
      ctx.restore();

      // Postmark wavy cancellation lines
      ctx.strokeStyle = "#8B4B32";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = -1; i <= 1; i++) {
        const y = 130 + i * 14;
        ctx.moveTo(850, y);
        ctx.bezierCurveTo(890, y - 8, 930, y + 8, 970, y);
      }
      ctx.stroke();

      // 4. Hero Artwork / Image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = photo;

      await new Promise((resolve) => {
        img.onload = () => {
          try {
            // Draw image centered in 1000x820 frame
            const frameX = 100;
            const frameY = 190;
            const frameW = 1000;
            const frameH = 820;

            // Image clipping with rounded corners
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, 16);
            ctx.clip();

            // Cover sizing
            const scale = Math.max(frameW / img.width, frameH / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = frameX + (frameW - w) / 2;
            const y = frameY + (frameH - h) / 2;
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();

            // Frame border
            ctx.strokeStyle = "#D4C7B4";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, 16);
            ctx.stroke();
          } catch {}
          resolve();
        };
        img.onerror = () => resolve();
      });

      // 5. Postcard Content / Typography
      // Monument Name
      ctx.fillStyle = "#2B2119";
      ctx.font = "bold 56px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(site.name, 600, 1080);

      // Era & Year Badge
      ctx.fillStyle = "#A34726";
      ctx.font = "600 24px -apple-system, sans-serif";
      ctx.fillText(`${eraLabel(site.era)}  •  Built c. ${yearBuilt} CE`, 600, 1130);

      // Coordinates & Area
      ctx.fillStyle = "#7A6B5D";
      ctx.font = "500 20px monospace";
      ctx.fillText(`${coords}  •  ${site.area || "Hyderabad"}`, 600, 1175);

      // Dividing Line
      ctx.strokeStyle = "#D4C7B4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 1220);
      ctx.lineTo(950, 1220);
      ctx.stroke();

      // Brief Summary / Historical snippet
      ctx.fillStyle = "#4A3B2C";
      ctx.font = "italic 22px Georgia, serif";
      ctx.textAlign = "center";
      const desc = site.summary || site.significance || "Preserving 500 years of Deccan history and architectural splendour.";
      // Wrap text
      const words = desc.split(" ");
      let line = "";
      let textY = 1270;
      for (let n = 0; n < words.length && textY <= 1400; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 900 && n > 0) {
          ctx.fillText(line, 600, textY);
          line = words[n] + " ";
          textY += 34;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line, 600, textY);

      // 6. Postcard Footer
      ctx.fillStyle = "#8B7B6C";
      ctx.font = "16px sans-serif";
      ctx.fillText("heritage.mapmyhyd.com  •  Preserve Deccan Heritage", 600, 1500);

      // 7. Trigger Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `deccan-postcard-${site.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate postcard canvas", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="dhm-postcard-modal-backdrop" onClick={onClose} role="dialog" aria-label="Heritage Postcard View">
      <div className="dhm-postcard-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="dhm-postcard-modal-top">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎴</span>
            <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "Fraunces, serif" }}>Heritage Postcard</span>
          </div>
          <button className="dhm-postcard-close" onClick={onClose} aria-label="Close postcard">✕</button>
        </div>

        {/* The Vintage Postcard Card Preview */}
        <div ref={cardRef} className="dhm-postcard-preview-card">
          <div className="dhm-postcard-inner">
            {/* Header Header & Stamps */}
            <div className="dhm-postcard-card-header">
              <div className="dhm-postcard-stamp-left">
                <span className="dhm-pc-brand">DECCAN HERITAGE ATLAS</span>
                <span className="dhm-pc-archive-tag">HYDERABAD FIELD NOTE</span>
              </div>
              <div className="dhm-postcard-stamp-right">
                <div className="dhm-vintage-postmark">
                  <span>DECCAN</span>
                  <strong>{yearBuilt}</strong>
                  <small>POSTAGE</small>
                </div>
              </div>
            </div>

            {/* Postcard Image */}
            <div className="dhm-postcard-img-wrap">
              <img src={photo} alt={site.name} className="dhm-postcard-hero-img" />
              {site.id === "charminar" && (
                <div className="dhm-pc-art-badge">Photo Revival Edition</div>
              )}
            </div>

            {/* Typography Section */}
            <div className="dhm-postcard-card-body">
              <h2 className="dhm-postcard-title">{site.name}</h2>
              <div className="dhm-postcard-era-line">
                <span style={{ color: eraColor(site.era), fontWeight: 700 }}>{eraLabel(site.era)}</span>
                <span>•</span>
                <span>Built c. {yearBuilt} CE</span>
              </div>
              <div className="dhm-postcard-coords">{coords}</div>
              
              <div className="dhm-postcard-divider" />
              <p className="dhm-postcard-quote">
                "{site.significance || site.summary || "Preserving 500 years of Deccan history and architecture."}"
              </p>
            </div>

            {/* Postcard Footer Note */}
            <div className="dhm-postcard-card-footer">
              <span>heritage.mapmyhyd.com</span>
              <span>Deccan Heritage Project</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="dhm-postcard-actions">
          <button
            className="dhm-btn primary pressable"
            onClick={handleDownloadPostcard}
            disabled={downloading}
            style={{ flex: 1.2 }}
          >
            <Icon name="compass" size={16} color="#fff" />
            {downloading ? "Rendering..." : "Download Postcard"}
          </button>
          <button
            className="dhm-btn pressable"
            onClick={handleNativeShare}
            title="Share with friends"
          >
            <Icon name="route" size={15} color="var(--ink-soft)" />
            Share
          </button>
          <button
            className="dhm-btn ghost pressable"
            onClick={handleCopyLink}
            title="Copy link"
          >
            <Icon name="bookmark" size={15} color="var(--ink-soft)" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
