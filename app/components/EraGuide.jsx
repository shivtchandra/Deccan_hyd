"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons.jsx";
import { ERAS } from "../../lib/heritage.js";
import { ERA_NARRATIVES } from "../../lib/eraNarratives.js";

// ── Ambient audio (ported from EraAudioPlayer) ─────────────────────────────
const ERA_CONFIGS = {
  default: {
    drones: [[146.8, "sine", 0.03], [293.6, "sine", 0.018]],
    filterFreq: 500, filterType: "lowpass", noiseGain: 0.012,
  },
  earlier: {
    drones: [[130.8, "sine", 0.032], [138.6, "sine", 0.02], [174.6, "sine", 0.018], [196.0, "sine", 0.015]],
    filterFreq: 900, filterType: "bandpass", noiseGain: 0.02,
  },
  "qutb-shahi": {
    drones: [[73.4, "sawtooth", 0.016], [146.8, "sine", 0.028], [155.6, "sine", 0.012], [196.0, "sine", 0.018], [220.0, "sine", 0.01]],
    filterFreq: 700, filterType: "lowpass", noiseGain: 0.008,
  },
  "asaf-jahi": {
    drones: [[65.4, "square", 0.012], [130.8, "sine", 0.025], [164.8, "sine", 0.018], [185.0, "sine", 0.012], [196.0, "sine", 0.01]],
    filterFreq: 650, filterType: "lowpass", noiseGain: 0.01,
  },
  "british-residency": {
    drones: [[164.8, "sine", 0.025], [196.0, "sine", 0.02], [246.9, "sine", 0.018], [329.6, "sine", 0.012]],
    filterFreq: 1400, filterType: "lowpass", noiseGain: 0.014,
  },
  "nizam-civic": {
    drones: [[110.0, "sine", 0.022], [146.8, "sine", 0.02], [174.6, "sine", 0.015], [220.0, "sine", 0.012]],
    filterFreq: 850, filterType: "lowpass", noiseGain: 0.018,
  },
};

function buildPinkNoiseBuffer(ctx) {
  const rate = ctx.sampleRate;
  const frames = rate * 4;
  const buf = ctx.createBuffer(1, frames, rate);
  const data = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < frames; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

function buildSoundscape(ctx, masterGain, config) {
  const nodes = [];
  const noiseBuf = buildPinkNoiseBuffer(ctx);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuf;
  noiseSource.loop = true;
  noiseSource.loopEnd = noiseBuf.duration;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = config.filterType;
  noiseFilter.frequency.value = config.filterFreq;
  noiseFilter.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = config.noiseGain;
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSource.start();
  nodes.push(noiseSource, noiseFilter, noiseGain);

  for (const [freq, type, gain] of config.drones) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6;
    const oscGain = ctx.createGain();
    oscGain.gain.value = gain;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08 + Math.random() * 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = gain * 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = config.filterFreq * 1.8;
    droneFilter.Q.value = 0.5;
    osc.connect(droneFilter);
    droneFilter.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start();
    lfo.start();
    nodes.push(osc, oscGain, lfo, lfoGain, droneFilter);
  }
  return nodes;
}

function stopNodes(nodes) {
  for (const n of nodes) {
    try { n.stop?.(); } catch (_) {}
    try { n.disconnect(); } catch (_) {}
  }
}

// ── Component ───────────────────────────────────────────────────────────────
export default function EraGuide({ eraKey }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);

  const uttRef = useRef(null);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const nodesRef = useRef([]);

  const era = eraKey ? ERAS[eraKey] : null;
  const content = eraKey ? ERA_NARRATIVES[eraKey] : null;
  const hasContent = !!(era && content);

  // Cancel TTS + reset on era change
  useEffect(() => {
    if (uttRef.current) {
      window.speechSynthesis?.cancel();
      uttRef.current = null;
    }
    setTtsPlaying(false);
  }, [eraKey]);

  // Crossfade ambient audio on era change
  useEffect(() => {
    if (!ambientOn || !ctxRef.current || !masterRef.current) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.7);
    const old = nodesRef.current;
    const timer = setTimeout(() => {
      stopNodes(old);
      const cfg = ERA_CONFIGS[eraKey] || ERA_CONFIGS.default;
      nodesRef.current = buildSoundscape(ctx, master, cfg);
      master.gain.setTargetAtTime(0.45, ctx.currentTime, 1.2);
    }, 1100);
    return () => clearTimeout(timer);
  }, [eraKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start / stop ambient
  useEffect(() => {
    if (!ambientOn) {
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.6);
        const ctx = ctxRef.current;
        const nodes = nodesRef.current;
        setTimeout(() => { stopNodes(nodes); ctx.close(); }, 1200);
        ctxRef.current = null;
        masterRef.current = null;
        nodesRef.current = [];
      }
      return;
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;
    const cfg = ERA_CONFIGS[eraKey] || ERA_CONFIGS.default;
    nodesRef.current = buildSoundscape(ctx, master, cfg);
    master.gain.setTargetAtTime(0.45, ctx.currentTime, 1.8);
    return () => {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
      const nodes = nodesRef.current;
      setTimeout(() => { stopNodes(nodes); ctx.close(); }, 1200);
    };
  }, [ambientOn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    if (ctxRef.current) { stopNodes(nodesRef.current); ctxRef.current.close(); }
  }, []);

  function toggleTts() {
    if (!content) return;
    if (ttsPlaying) {
      window.speechSynthesis.cancel();
      uttRef.current = null;
      setTtsPlaying(false);
    } else {
      const utt = new SpeechSynthesisUtterance(content.narrative);
      utt.rate = 0.88;
      utt.pitch = 1.0;
      utt.onend = () => { uttRef.current = null; setTtsPlaying(false); };
      utt.onerror = () => { uttRef.current = null; setTtsPlaying(false); };
      uttRef.current = utt;
      window.speechSynthesis.speak(utt);
      setTtsPlaying(true);
    }
  }

  const isActive = panelOpen || ttsPlaying || ambientOn;

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`dhm-audio-btn pressable-sm material${isActive ? " active" : ""}${!hasContent ? " dimmed" : ""}`}
        onClick={() => hasContent && setPanelOpen((v) => !v)}
        aria-label={panelOpen ? "Close era guide" : "Open era guide"}
        title={hasContent ? (era?.label || "Era guide") : "Select an era to open the guide"}
        disabled={!hasContent}
      >
        <Icon
          name="headphones"
          size={17}
          width={2}
          color={isActive ? "var(--accent-deep)" : "var(--ink-soft)"}
        />
      </button>

      {/* Backdrop */}
      {panelOpen && (
        <div
          className="era-guide-backdrop"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-up guide panel */}
      <div className={`era-guide-panel${panelOpen ? " open" : ""}`}>
        <div className="era-guide-handle" />

        <div className="era-guide-header">
          <div>
            <div
              className="era-guide-era-dot"
              style={{ background: `var(--era-${eraKey}, var(--muted))` }}
            />
            <span className="era-guide-era-name">{era?.label}</span>
          </div>
          <button
            className="era-guide-close pressable-sm"
            onClick={() => setPanelOpen(false)}
            aria-label="Close guide"
          >
            <Icon name="close" size={16} width={2} color="var(--ink-soft)" />
          </button>
        </div>

        {content && (
          <p className="era-guide-hook">{content.hook}</p>
        )}

        <p className="era-guide-text">{content?.narrative}</p>

        <div className="era-guide-controls">
          <button
            className={`era-guide-listen-btn pressable-sm${ttsPlaying ? " playing" : ""}`}
            onClick={toggleTts}
            aria-label={ttsPlaying ? "Stop narration" : "Listen to guide"}
          >
            <Icon
              name={ttsPlaying ? "mute" : "volume"}
              size={15}
              width={2}
              color={ttsPlaying ? "var(--accent-deep)" : "var(--ink-soft)"}
            />
            <span>{ttsPlaying ? "Stop" : "Listen"}</span>
          </button>

          <button
            className={`era-guide-ambient-btn pressable-sm${ambientOn ? " on" : ""}`}
            onClick={() => setAmbientOn((v) => !v)}
            aria-label={ambientOn ? "Mute ambient sound" : "Play ambient sound"}
          >
            <Icon
              name="layers"
              size={15}
              width={2}
              color={ambientOn ? "var(--accent-deep)" : "var(--ink-soft)"}
            />
            <span>Ambience</span>
          </button>
        </div>
      </div>
    </>
  );
}
