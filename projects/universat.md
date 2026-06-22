---
layout: project
permalink: /universat
title: "UniverSat: Resolution- and Modality-Agnostic Transformers for Earth Observation"
short_name: UniverSat
author: Guillaume Astruc
description: "UniverSat is a ViT-style backbone for Earth Observation built around a Universal Patch Encoder that handles arbitrary spatial, spectral, and temporal resolutions, and any sensor — with a single set of weights."
keywords: remote sensing, self-supervised learning, multimodal learning, earth observation, satellite imagery, foundation model, vision transformer, hyperspectral, radar, LiDAR
analytics: https://www.googletagmanager.com/gtag/js?id=G-FLNC8B6RH9

paper_title: "UniverSat: Resolution- and Modality-Agnostic Transformers for Earth Observation"
paper_authors: "<a href=\"https://yohannperron.github.io/WebPage/\">Yohann Perron</a>*, <a href=\"/\">Guillaume Astruc</a>*, <a href=\"https://ngonthier.github.io/\">Nicolas Gonthier</a>, <a href=\"https://www.umr-lastig.fr/clement-mallet/\">Clement Mallet</a>, <a href=\"https://loiclandrieu.com/\">Loic Landrieu</a>"
journal: arXiv preprint, 2026
---

<script>
  document.body.classList.add('universat-page-body');
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --us-bg: #ffffff;
    --us-surface: #f5f7fb;
    --us-card: #ffffff;
    --us-border: rgba(10, 30, 60, 0.08);
    --us-accent: #5a4fff;
    --us-accent2: #00c2a8;
    --us-accent3: #ff7a59;
    --us-text: #0b1320;
    --us-muted: #586481;
    --us-white: #0b1320;
  }

  body.universat-page-body.dark-theme {
    --us-bg: #07091a;
    --us-surface: #0c1124;
    --us-card: #11172e;
    --us-border: rgba(120, 130, 200, 0.12);
    --us-text: #e6ecff;
    --us-muted: #8a96b7;
    --us-white: #f4f6ff;
    background: var(--us-bg) !important;
    color: var(--us-text) !important;
  }

  body.universat-page-body {
    background: var(--us-bg);
    color: var(--us-text);
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    line-height: 1.7;
    overflow-x: hidden;
  }

  body.universat-page-body .project-header { display: none !important; }
  body.universat-page-body #abstract { display: none !important; }
  body.universat-page-body footer:not(.universat-footer) { display: none !important; }
  body.universat-page-body #main { padding: 0 !important; margin-bottom: 0 !important; }
  body.universat-page-body #approach { padding: 0 !important; }

  .universat-page { position: relative; }

  /* HERO */
  .universat-page .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 100px 24px 60px;
    overflow: hidden;
    background:
      radial-gradient(circle at 20% 20%, rgba(90, 79, 255, 0.10) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(0, 194, 168, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 50% 100%, rgba(255, 122, 89, 0.06) 0%, transparent 50%);
  }

  .universat-page .orbit-bg {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at center, rgba(90, 79, 255, 0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at center, black 35%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 80%);
  }

  /* Full-bleed hero banner (embedding-field cover) */
  .universat-page .hero-banner {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #0a0e1e;
  }
  .universat-page .banner-track {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    width: max-content;
    will-change: transform;
  }
  .universat-page .banner-track img {
    height: 100%;
    width: auto;
    display: block;
    flex: 0 0 auto;
  }
  .universat-page .track-a { animation: us-scroll-left 50s linear infinite; }
  .universat-page .track-b { animation: us-scroll-right 66s linear infinite; }
  @keyframes us-scroll-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
  @keyframes us-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) {
    .universat-page .banner-track { animation: none; }
  }
  .universat-page .hero-scrim {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 86% 66% at 50% 45%, rgba(7, 9, 26, 0.24) 0%, rgba(7, 9, 26, 0.54) 100%),
      linear-gradient(180deg, rgba(7, 9, 26, 0.60) 0%, rgba(7, 9, 26, 0.26) 30%, rgba(7, 9, 26, 0.38) 66%, rgba(7, 9, 26, 0.90) 100%);
  }

  /* Hero text reads light over the banner in BOTH themes */
  .universat-page .hero h1.us-title { color: #ffffff; text-shadow: 0 2px 34px rgba(0, 0, 0, 0.35); }
  .universat-page .hero .tagline { color: rgba(236, 240, 255, 0.90); text-shadow: 0 1px 16px rgba(0, 0, 0, 0.55); }
  .universat-page .hero .tagline strong { color: #ffffff; }
  .universat-page .hero .authors { color: rgba(236, 240, 255, 0.95); text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }
  .universat-page .hero .authors a { color: #c6c0ff; }
  .universat-page .hero .affiliations { color: rgba(214, 221, 248, 0.78); text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55); }
  .universat-page .hero .scroll-hint { color: rgba(212, 219, 247, 0.72); }
  .universat-page .hero .venue-tag {
    background: rgba(12, 17, 36, 0.55);
    border-color: rgba(150, 145, 255, 0.5);
    color: #cfcaff;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .universat-page .hero .btn-outline {
    color: #eef0ff;
    border-color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.05);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .universat-page .hero .btn-outline:hover { border-color: #bcb5ff; color: #ffffff; }

  .universat-page .venue-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(90, 79, 255, 0.12), rgba(0, 194, 168, 0.12));
    border: 1px solid rgba(90, 79, 255, 0.3);
    color: var(--us-accent);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.74rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 24px;
    margin-bottom: 26px;
    position: relative;
    z-index: 1;
  }
  .universat-page .venue-tag::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--us-accent);
    box-shadow: 0 0 12px var(--us-accent);
  }

  .universat-page h1.us-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.6rem, 7vw, 5rem);
    font-weight: 700;
    color: var(--us-white);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 14px;
    position: relative;
    z-index: 1;
  }
  .universat-page h1.us-title .accent {
    background: linear-gradient(135deg, var(--us-accent), var(--us-accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .universat-page .tagline {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.05rem, 1.6vw, 1.35rem);
    font-weight: 500;
    color: var(--us-muted);
    max-width: 760px;
    margin: 0 auto 28px;
    position: relative;
    z-index: 1;
  }
  .universat-page .tagline strong { color: var(--us-white); font-weight: 600; }

  .universat-page .authors {
    font-size: 1rem;
    color: var(--us-text);
    max-width: 720px;
    margin: 0 auto 8px;
    line-height: 1.9;
    position: relative;
    z-index: 1;
  }
  .universat-page .authors a { color: var(--us-accent); text-decoration: none; font-weight: 500; }
  .universat-page .authors a:hover { text-decoration: underline; }

  .universat-page .affiliations {
    font-size: 0.84rem;
    color: var(--us-muted);
    margin: 0 auto 36px;
    max-width: 720px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  .universat-page .btn-group {
    display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
    position: relative; z-index: 1;
  }

  .universat-page .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }
  .universat-page .btn-primary {
    background: linear-gradient(135deg, var(--us-accent), #7c70ff);
    color: white;
    box-shadow: 0 6px 24px rgba(90, 79, 255, 0.3);
  }
  .universat-page .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(90, 79, 255, 0.45); }

  .universat-page .btn-outline {
    background: transparent;
    color: var(--us-text);
    border: 1px solid var(--us-border);
  }
  .universat-page .btn-outline:hover { border-color: var(--us-accent); color: var(--us-accent); transform: translateY(-2px); }

  .universat-page .scroll-hint {
    position: absolute; bottom: 30px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: var(--us-muted);
    font-size: 0.72rem;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    animation: us-bob 2.2s ease-in-out infinite;
    z-index: 1;
    pointer-events: none;
  }
  @keyframes us-bob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(7px); } }

  /* SECTIONS */
  .universat-page section {
    max-width: 980px;
    margin: 0 auto;
    padding: 84px 24px;
  }

  .universat-page .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--us-accent);
    margin-bottom: 14px;
  }

  .universat-page h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.9rem, 4vw, 2.7rem);
    font-weight: 700;
    color: var(--us-white);
    margin: 0 0 24px;
    line-height: 1.18;
    letter-spacing: -0.015em;
  }

  .universat-page p { margin: 0 0 18px; font-size: 1.05rem; }
  .universat-page strong { color: var(--us-white); }
  .universat-page em { color: var(--us-accent); font-style: normal; font-weight: 500; }

  .universat-page .divider {
    max-width: 980px;
    margin: 0 auto;
    border: none;
    border-top: 1px solid var(--us-border);
  }

  .universat-page .paper-figure { margin: 28px 0 10px; text-align: center; }
  .universat-page .paper-figure img {
    width: 100%;
    max-width: 1100px;
    border-radius: 14px;
    box-shadow: 0 12px 36px rgba(10, 20, 50, 0.10);
    background: white;
  }
  body.universat-page-body.dark-theme .universat-page .paper-figure img {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--us-border);
  }
  .universat-page .paper-figure-reduced img { max-width: 720px !important; width: auto !important; display: block; margin: 0 auto; }
  .universat-page .paper-figure-small img { max-width: 480px !important; width: auto !important; display: block; margin: 0 auto; }

  .universat-page .paper-caption {
    margin-top: 12px;
    color: var(--us-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.03em;
    line-height: 1.5;
  }

  /* Pillars / cards */
  .universat-page .pillars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    margin: 36px 0;
  }
  .universat-page .pillar {
    background: var(--us-card);
    border: 1px solid var(--us-border);
    border-radius: 14px;
    padding: 26px 22px;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .universat-page .pillar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba(90, 79, 255, 0.04) 100%);
    pointer-events: none;
  }
  .universat-page .pillar:hover { transform: translateY(-4px); border-color: var(--us-accent); box-shadow: 0 14px 30px rgba(90, 79, 255, 0.12); }
  .universat-page .pillar-icon {
    font-size: 1.5rem;
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(90, 79, 255, 0.12), rgba(0, 194, 168, 0.12));
    border-radius: 10px;
    margin-bottom: 14px;
  }
  .universat-page .pillar h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.05rem; font-weight: 600;
    color: var(--us-white);
    margin: 0 0 8px;
  }
  .universat-page .pillar p { font-size: 0.92rem; color: var(--us-muted); margin: 0; line-height: 1.6; }

  /* Stats */
  .universat-page .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
    margin: 28px 0;
  }
  .universat-page .stat-box {
    background: var(--us-card);
    border: 1px solid var(--us-border);
    border-radius: 12px;
    padding: 22px 18px;
    text-align: center;
  }
  .universat-page .stat-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.3rem; font-weight: 700;
    background: linear-gradient(135deg, var(--us-accent), var(--us-accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 6px;
  }
  .universat-page .stat-label {
    font-size: 0.82rem;
    color: var(--us-muted);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.03em;
    line-height: 1.4;
  }

  /* Modality pills */
  .universat-page .modality-grid {
    display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
    margin: 32px 0 8px;
  }
  .universat-page .modality-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--us-card);
    border: 1px solid var(--us-border);
    border-radius: 40px;
    padding: 8px 16px;
    font-size: 0.88rem;
    color: var(--us-text);
    transition: border-color 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .universat-page .modality-pill:hover { border-color: var(--us-accent); transform: translateY(-2px); }
  .universat-page .modality-pill .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

  /* Insight callout */
  .universat-page .insight {
    border-left: 3px solid var(--us-accent3);
    padding: 22px 28px;
    margin: 32px 0;
    background: linear-gradient(90deg, rgba(255, 122, 89, 0.06), rgba(255, 122, 89, 0.0));
    border-radius: 0 12px 12px 0;
    font-size: 1.05rem;
    color: var(--us-text);
  }
  .universat-page .insight strong { color: var(--us-accent3); }

  /* Bibtex */
  .universat-page .bibtex-block {
    background: var(--us-surface);
    border: 1px solid var(--us-border);
    border-radius: 12px;
    padding: 28px;
    position: relative;
  }
  .universat-page .bibtex-block pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: var(--us-muted);
    white-space: pre-wrap;
    line-height: 1.8;
    margin: 0;
  }
  .universat-page .copy-btn {
    position: absolute;
    top: 16px; right: 16px;
    background: var(--us-card);
    border: 1px solid var(--us-border);
    color: var(--us-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.06em;
  }
  .universat-page .copy-btn:hover { color: var(--us-accent); border-color: var(--us-accent); }

  .universat-page footer.universat-footer {
    text-align: center;
    padding: 40px 24px;
    border-top: 1px solid var(--us-border);
    color: var(--us-muted);
    font-size: 0.82rem;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.06em;
  }

  .universat-page .fade-in {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .universat-page .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* Quick start / usage */
  .universat-page .quickstart-card {
    background: var(--us-card);
    border: 1px solid var(--us-border);
    border-radius: 14px;
    padding: 26px 26px 18px;
    margin: 24px 0;
    box-shadow: 0 6px 22px rgba(10, 20, 50, 0.05);
  }
  .universat-page .quickstart-card h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem; font-weight: 600;
    color: var(--us-white);
    margin: 0 0 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .universat-page .quickstart-card h3 .step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--us-accent), var(--us-accent2));
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem; font-weight: 600;
  }

  .universat-page pre.code-block {
    background: #0b1320;
    color: #e6ecff;
    border: 1px solid rgba(120, 130, 200, 0.18);
    border-radius: 10px;
    padding: 18px 20px;
    margin: 0;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.86rem;
    line-height: 1.65;
  }
  body.universat-page-body.dark-theme .universat-page pre.code-block {
    background: #060914;
  }
  .universat-page pre.code-block .c { color: #6f7c97; }   /* comment */
  .universat-page pre.code-block .k { color: #b57bee; }   /* keyword */
  .universat-page pre.code-block .s { color: #6ecf85; }   /* string */
  .universat-page pre.code-block .n { color: #3ec9e0; }   /* identifier highlight */
  .universat-page pre.code-block .o { color: #ff9ab2; }   /* operator */
  .universat-page pre.code-block .num { color: #f4c430; } /* number */

  .universat-page .copy-code-btn {
    position: absolute;
    top: 12px; right: 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    color: #aab3d4;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .universat-page .copy-code-btn:hover { color: white; border-color: var(--us-accent); }
  .universat-page .code-wrapper { position: relative; }

  .universat-page .inline-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.88em;
    background: var(--us-surface);
    color: var(--us-accent);
    padding: 2px 7px;
    border-radius: 5px;
    border: 1px solid var(--us-border);
  }

  /* Contributions list */
  .universat-page .contrib-list {
    list-style: none;
    padding: 0;
    margin: 24px 0;
  }
  .universat-page .contrib-list li {
    padding: 14px 0 14px 36px;
    border-bottom: 1px solid var(--us-border);
    position: relative;
    color: var(--us-text);
    font-size: 1rem;
  }
  .universat-page .contrib-list li:last-child { border-bottom: none; }
  .universat-page .contrib-list li::before {
    content: '◇';
    position: absolute;
    left: 8px; top: 13px;
    color: var(--us-accent);
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    .universat-page section { padding: 60px 20px; }
    .universat-page .pillars { grid-template-columns: 1fr; }
    .universat-page .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>

<div class="universat-page">
  <div class="hero">
    <div class="hero-banner">
      <div class="banner-track track-a">
        <img src="/assets/publications/universat/pca/stripA.jpg?v=2" alt="" aria-hidden="true">
        <img src="/assets/publications/universat/pca/stripA.jpg?v=2" alt="" aria-hidden="true">
      </div>
      <div class="banner-track track-b">
        <img src="/assets/publications/universat/pca/stripB.jpg?v=2" alt="" aria-hidden="true">
        <img src="/assets/publications/universat/pca/stripB.jpg?v=2" alt="" aria-hidden="true">
      </div>
    </div>
    <div class="hero-scrim"></div>
    <div class="venue-tag">arXiv preprint &middot; 2026</div>
    <h1 class="us-title">Univer<span class="accent">Sat</span></h1>
    <p class="tagline">
      A <strong>resolution-</strong> and <strong>modality-agnostic</strong> transformer backbone for Earth Observation:
      one set of weights for any sensor, any spatial/spectral/temporal resolution and any scale.
    </p>
    <p class="authors">
      <a href="https://yohannperron.github.io/WebPage/">Yohann Perron</a><sup>*</sup>&nbsp;&middot;&nbsp;<a href="/">Guillaume Astruc</a><sup>*</sup>&nbsp;&middot;&nbsp;<a href="https://ngonthier.github.io/">Nicolas Gonthier</a>&nbsp;&middot;&nbsp;<a href="https://www.umr-lastig.fr/clement-mallet/">Clement Mallet</a>&nbsp;&middot;&nbsp;<a href="https://loiclandrieu.com/">Loic Landrieu</a>
    </p>
    <p class="affiliations">
      <sup>*</sup>Equal contribution &middot; LASTIG, Univ Gustave Eiffel&nbsp;|&nbsp;IGN&nbsp;|&nbsp;ENSG&nbsp;|&nbsp;CNES&nbsp;|&nbsp; LIGM, ENPC, IPP&nbsp;|&nbsp;EFEO
    </p>

    <div class="btn-group">
      <a class="btn btn-primary" href="/assets/publications/universat/universat.pdf" target="_blank" rel="noopener">📄 Paper</a>
      <a class="btn btn-outline" href="https://github.com/gastruc/UniverSat" target="_blank" rel="noopener">💻 Code</a>
      <a class="btn btn-outline" href="#usage">⚡ Quick Start</a>
      <a class="btn btn-outline" href="#citation">Citation</a>
    </div>

    <div class="scroll-hint">
      <span>scroll</span>
      <svg width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true">
        <path d="M6 0v14M1 9l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>
  </div>

  <section class="fade-in">
    <div class="section-label">Overview</div>
    <h2>One Model. Any Sensor. Any Resolution.</h2>
    <p style="font-size: 1.1rem;">
      ViTs assume a <strong>fixed input format</strong>. Earth Observation doesn't play by that rule:
    </p>

    <ul class="contrib-list" style="margin: 18px 0 28px;">
      <li><strong>Modalities</strong> — optical, radar, hyperspectral, elevation</li>
      <li><strong>Spatial resolution</strong> — centimetres to hundreds of metres</li>
      <li><strong>Image size</strong> — tiny patches to multi-kilometre tiles, <em>no two images share the same shape</em></li>
      <li><strong>Temporal depth</strong> — single snapshot up to <em>150+ revisits</em></li>
      <li><strong>Spectral width</strong> — from one band to <em>396 channels</em></li>
    </ul>

    <p style="font-size: 1.1rem;">
      <strong>UniverSat</strong> handles all of this with a <strong>single set of weights</strong> — no resampling, no channel selection, no per-sensor encoder.
      It is a ViT-style backbone built around a <strong>Universal Patch Encoder (UPE)</strong> that maps patches of arbitrary spatial,
      spectral, and temporal shape into a shared embedding space. One model is trained jointly on <strong>13 sensors from 7 datasets</strong>,
      generalises to <em>unseen sensors</em> within this gamut without input resampling, and stays competitive on standard benchmarks.
    </p>

    <div class="paper-figure paper-figure-reduced">
      <img src="/assets/publications/universat/Figure1.png" alt="UniverSat — One Model, Many Sensors" />
      <div class="paper-caption">Figure 1: A single UniverSat trained jointly on 13 sensors from 7 datasets, spanning ~3 orders of magnitude in spatial resolution, channel count, and revisit frequency.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in" id="usage">
    <div class="section-label">Quick Start</div>
    <h2>Use UniverSat in three lines.</h2>
    <p>
      UniverSat is designed to be a <strong>drop-in backbone</strong> for any EO pipeline. Load the pretrained weights in
      <strong>one line</strong> via <span class="inline-code">torch.hub</span> — no clone, no config — feed a dict of whichever sensors you have,
      and read out dense embeddings at <em>any</em> output resolution. No modality-specific preprocessing, no channel filtering,
      no input resampling.
    </p>

    <div class="quickstart-card">
      <h3><span class="step-num">1</span> Load a pretrained model</h3>
      <p style="font-size: 0.95rem; color: var(--us-muted); margin: -4px 0 14px;">
        The model is published on the <strong>Hugging Face Hub</strong> with
        <a href="https://huggingface.co/docs/huggingface_hub/package_reference/mixins#huggingface_hub.PyTorchModelHubMixin" target="_blank" rel="noopener"><span class="inline-code">PyTorchModelHubMixin</span></a>.
        With the repo on your path and <span class="inline-code">huggingface_hub</span> installed:
      </p>
      <div class="code-wrapper">
        <button class="copy-code-btn" onclick="universatCopyCode('us-code-load')">Copy</button>
        <pre id="us-code-load" class="code-block"><span class="k">from</span> hubconf <span class="k">import</span> UniverSat

model = UniverSat.from_pretrained(<span class="s">'g-astruc/UniverSat'</span>).eval()</pre>
      </div>
      <p style="font-size: 0.95rem; color: var(--us-muted); margin: 18px 0 12px;">
        Or, equivalently, through <strong>Torch Hub</strong> — no local checkout needed, same tracked download:
      </p>
      <div class="code-wrapper">
        <button class="copy-code-btn" onclick="universatCopyCode('us-code-load-alt')">Copy</button>
        <pre id="us-code-load-alt" class="code-block"><span class="k">import</span> torch

model = torch.hub.load(<span class="s">'gastruc/UniverSat'</span>, <span class="s">'from_pretrained'</span>).eval()</pre>
      </div>
      <p style="font-size: 0.88rem; color: var(--us-muted); margin: 14px 0 0;">
        Loading requires <span class="inline-code">huggingface_hub</span> (and <span class="inline-code">safetensors</span>). The released checkpoint is a <strong>Base</strong> UniverSat (~201&nbsp;M params).
      </p>
      <p style="font-size: 0.88rem; color: var(--us-muted); margin: 10px 0 0;">
        💡 <strong>Interactive inference?</strong> Disable <span class="inline-code">torch.compile</span> — set
        <span class="inline-code">torch._dynamo.config.disable = True</span> (or <span class="inline-code">TORCH_COMPILE_DISABLE=1</span>)
        before the first forward, since the one-off compile cost never amortises over a few varying-shape passes.
      </p>
    </div>

    <div class="quickstart-card">
      <h3><span class="step-num">2</span> Encode any sensor combination</h3>
      <div class="code-wrapper">
        <button class="copy-code-btn" onclick="universatCopyCode('us-code-forward')">Copy</button>
        <pre id="us-code-forward" class="code-block"><span class="c"># Snapshot modalities: (B, C, H, W). Time series: (B, T, C, H, W) + &lt;mod&gt;_dates.</span>
data = {
    <span class="s">'spot'</span>:      torch.randn(<span class="num">2</span>, <span class="num">3</span>, <span class="num">360</span>, <span class="num">360</span>),      <span class="c"># 1 m VHR, RGB snapshot</span>
    <span class="s">'s2'</span>:        torch.randn(<span class="num">2</span>, <span class="num">20</span>, <span class="num">10</span>, <span class="num">36</span>, <span class="num">36</span>),  <span class="c"># 10 m Sentinel-2 time series</span>
    <span class="s">'s2_dates'</span>:  torch.randint(<span class="num">0</span>, <span class="num">365</span>, (<span class="num">2</span>, <span class="num">20</span>)),
    <span class="s">'s1'</span>:        torch.randn(<span class="num">2</span>, <span class="num">12</span>, <span class="num">3</span>, <span class="num">36</span>, <span class="num">36</span>),   <span class="c"># 10 m Sentinel-1 (SAR) time series</span>
    <span class="s">'s1_dates'</span>:  torch.randint(<span class="num">0</span>, <span class="num">365</span>, (<span class="num">2</span>, <span class="num">12</span>)),
    <span class="s">'dsm'</span>:       torch.randn(<span class="num">2</span>, <span class="num">1</span>, <span class="num">12</span>, <span class="num">12</span>),        <span class="c"># 30 m elevation snapshot</span>
}

features, _ = model.encode(data, patch_size=<span class="num">40</span>, output_grid=<span class="num">36</span>)
<span class="c"># -> (2, 1296, 768): a 36x36 dense feature grid (register tokens stripped for you)</span></pre>
      </div>
      <p style="font-size: 0.92rem; color: var(--us-muted); margin: 16px 0 0;">
        <span class="inline-code">model.encode(...)</span> looks up per-modality wavelengths, physical resolution, and sub-patch
        factors automatically from a built-in registry — <span class="inline-code">s2</span>, <span class="inline-code">s1</span>,
        <span class="inline-code">spot</span>, <span class="inline-code">aerial</span>, <span class="inline-code">naip</span>,
        <span class="inline-code">l7</span>/<span class="inline-code">l8</span>, <span class="inline-code">modis</span>,
        <span class="inline-code">alos</span>, <span class="inline-code">enmap</span>, <span class="inline-code">dsm</span>,
        <span class="inline-code">neon</span>, <span class="inline-code">hls</span>, and more.
      </p>
    </div>

    <div class="quickstart-card">
      <h3><span class="step-num">3</span> Control input and output resolutions</h3>
      <p style="font-size: 0.95rem; color: var(--us-muted); margin: -4px 0 14px;">
        With UniverSat, the output resolution is <strong>decoupled from the input patch size</strong>.
      </p>
      <p style="font-size: 0.95rem; color: var(--us-muted); margin: 0 0 14px;">
        First, choose the <span class="inline-code">patch_size</span> used to partition the input data. Smaller patches
        better capture local, fine-grained processes, while larger patches are more efficient.
      </p>
      <p style="font-size: 0.95rem; color: var(--us-muted); margin: 0 0 14px;">
        Then, choose the <span class="inline-code">output_grid</span>, i.e. the number of output tokens. The model returns a
        tensor of shape <span class="inline-code">D &times; output_grid &times; output_grid</span> (each token then covers
        <span class="inline-code">tile_extent / G</span> on the ground). Same model, same inputs — only the requested grid changes.
      </p>
      <div class="code-wrapper">
        <button class="copy-code-btn" onclick="universatCopyCode('us-code-resolution')">Copy</button>
        <pre id="us-code-resolution" class="code-block"><span class="c"># Same model, same inputs — only the requested output grid changes.</span>
patch, _   = model.encode(data, patch_size=<span class="num">40</span>, output_grid=<span class="num">9</span>)      <span class="c">#   9x9   patch-level</span>
dense, _   = model.encode(data, patch_size=<span class="num">40</span>, output_grid=<span class="num">36</span>)    <span class="c">#  36x36  dense</span>
highres, _ = model.encode(data, patch_size=<span class="num">40</span>, output_grid=<span class="num">180</span>)  <span class="c"># 180x180 high-res</span></pre>
      </div>
      <p style="font-size: 0.92rem; color: var(--us-muted); margin: 16px 0 0;">
        Under the hood: the patch-level transformer runs over a coarse spatial grid, then a <em>sub-patch skip cross-attention</em>
        recovers fine spatial detail at the requested grid — one bilinear resample plus one CA pass.
      </p>
      <p style="font-size: 0.92rem; color: var(--us-muted); margin: 14px 0 0;">
        See our tutorials on <a href="#" style="color: var(--us-accent); text-decoration: none; font-weight: 500;">probing</a>
        and <a href="#" style="color: var(--us-accent); text-decoration: none; font-weight: 500;">classification</a>.
      </p>
      <p style="font-size: 0.88rem; color: var(--us-muted); margin: 12px 0 0;">
        ⚠️ <strong>Note:</strong> small input patches or very fine output grids can significantly increase memory usage.
      </p>
    </div>

    <div class="insight">
      <strong>Unseen sensors? →</strong> Just pass the sensor's wavelengths (optical / hyperspectral),
      polarization (SAR), or revisit (time series) as <span class="inline-code">wavelengths={...}</span>,
      <span class="inline-code">input_res={...}</span>, <span class="inline-code">subpatches={...}</span> overrides to
      <span class="inline-code">encode(...)</span>. The Universal Patch Encoder uses these as positional encodings — no
      retraining needed. See the <em>generalization</em> experiments in the paper for results on HLS and EnMAP, which the
      model never saw during pretraining.
    </div>

    <div class="pillars" style="margin-top: 32px;">
      <div class="pillar">
        <div class="pillar-icon">🧊</div>
        <h3>Frozen-backbone friendly</h3>
        <p>Strong results with <em>linear probes</em> and just <span class="inline-code">9K</span> probe parameters — perfect for low-label regimes.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">🪶</div>
        <h3>Lightweight integrations</h3>
        <p>The forward pass returns standard dense features — plug them into any segmentation / classification head you already use.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">🧰</div>
        <h3>Reference recipes</h3>
        <p>The GitHub repo ships with fine-tuning, kNN, and linear-probe scripts for GeoBench, PangaeaBench, and SpectralEarth.</p>
      </div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Key Properties</div>
    <h2>One model for all your EO needs.</h2>
    <p>
      Integrated into a transformer that operates over spatialized tokens, the Universal Patch Encoder gives UniverSat
      three key advantages over rigid ViT-style EO foundation models:
    </p>

    <div class="pillars">
      <div class="pillar">
        <div class="pillar-icon">🌐</div>
        <h3>Sensor-agnostic</h3>
        <p>A single set of weights processes <strong>any modality combination</strong> and arbitrary resolutions — no resampling, no channel filtering.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">🔍</div>
        <h3>Resolution-flexible</h3>
        <p>The <strong>output spatial resolution</strong> is specified at inference time, decoupled from the input patch size.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">🧬</div>
        <h3>Granular</h3>
        <p>A <strong>sub-patch skip connection</strong> preserves fine spatial details well beyond the patch-level embedding.</p>
      </div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Table1.png" alt="UniverSat vs. EO foundation models" />
      <div class="paper-caption">Table 1: Flexible multimodal EO foundation models. UniverSat supports the broadest modality mix, handles unseen spatial / temporal / spectral configurations, and offers flexible output resolution — all with a single set of weights.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Architecture</div>
    <h2>The Universal Patch Encoder</h2>
    <p>
      Different sensors yield patches of fundamentally different shapes:
      <em>C</em> channels × <em>T</em> timestamps × <em>H × W</em> pixels. Naively projecting every shape with an MLP is impractical;
      applying full self-attention over all atomic tokens is prohibitive.
    </p>
    <p>
      The <strong>UPE</strong> instead lifts each scalar into a learnable embedding using <strong>Fourier features</strong>, and
      progressively collapses the spectral, temporal, spatial-within-patch, and sub-patch axes one at a time using
      linear-complexity <strong>Axial Cross-Attention</strong>. Each axis receives dedicated positional encodings
      (wavelength, polarization, time-of-year, etc.), so the encoder is intrinsically aware of <em>what</em> each input is — not just
      <em>where</em> it sits.
    </p>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Figure5.png" alt="UniverSat full architecture" />
      <div class="paper-caption">Figure 5: A tile is observed by multiple sensors of arbitrary modality and resolution. The shared UPE patchifies and embeds inputs; tokens are fused via Axial Cross-Attention (ACA), processed by self-attention blocks, resampled to the target resolution, and attend to high-resolution sub-patch embeddings via cross-attention (CA) to recover fine spatial details.</div>
    </div>

    <div class="insight">
      <strong>Why this matters →</strong>
      Where prior EO foundation models retrain or adapt encoders for each new sensor configuration, UniverSat treats
      <em>resolution, channel count and time</em> as first-class metadata of the input — not as a fixed property of the architecture.
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Training</div>
    <h2>Self-supervised on 13 sensors at once</h2>
    <p>
      UniverSat is trained with a self-supervised objective that combines (i) <strong>cross-modal contrastive learning</strong> at the
      patch level and (ii) <strong>latent multimodal masked modeling</strong> (LM₃), an extension of latent masked image modeling
      to heterogeneous, multimodal, multitemporal EO data.
    </p>
    <p>
      Aggressive input dropping — modalities, patches, channels, and timestamps — removes ≈90% of input atoms at training time,
      drastically improving robustness across scales and sensor configurations.
    </p>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Figure6.png" alt="UniverSat training scheme" />
      <div class="paper-caption">Figure 6: We feed UniverSat a heavily masked version of the input patches, apply a cross-modal contrastive loss on the UPE outputs, and predict random-projection targets of the masked patches via a batch-wise InfoNCE loss per modality.</div>
    </div>

    <div class="stats-grid">
      <div class="stat-box"><div class="stat-num">13</div><div class="stat-label">SENSORS</div></div>
      <div class="stat-box"><div class="stat-num">7</div><div class="stat-label">DATASETS</div></div>
      <div class="stat-box"><div class="stat-num">4</div><div class="stat-label">MODALITY TYPES</div></div>
      <div class="stat-box"><div class="stat-num">0.1–300m</div><div class="stat-label">GROUND SAMPLING DISTANCE</div></div>
      <div class="stat-box"><div class="stat-num">1–150</div><div class="stat-label">TIMESTAMPS</div></div>
      <div class="stat-box"><div class="stat-num">1–396</div><div class="stat-label">SPECTRAL CHANNELS</div></div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Figure7.png" alt="UniverSat training datasets" />
      <div class="paper-caption">Figure 7: Training datasets — distribution of atoms (one pixel × one band × one timestamp) across modalities and datasets, and the 13 supported sensors with their typical spatial resolution (S, m), temporal depth (T, images per year), number of channels (C), and total atom count.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Results</div>
    <h2>Competitive — and broader — than the state of the art</h2>
    <p>
      Despite its flexibility and ability to ingest unseen sensor configurations, UniverSat remains highly competitive on standard
      benchmarks. We evaluate on <strong>15 datasets</strong> spanning GeoBench, PangaeaBench, and the hyperspectral SpectralEarth benchmark
      using strict probing protocols (kNN and linear probing).
    </p>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Table2.png" alt="UniverSat probing results" />
      <div class="paper-caption">Table 2: Linear-probe / kNN classification and segmentation across GeoBench and PangaeaBench tasks (brick-kiln, pv4ger, forestnet, PASTIS-R, Sen1Floods11, chesapeake, NeonTree). UniverSat-B is competitive with or exceeds specialist baselines — despite being significantly more general than competing modality-specific approaches.</div>
    </div>

    <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; margin-top: 48px;">PangaeaBench — linear probes match heavyweight decoders</h3>
    <p>
      On PangaeaBench, competing models attach <strong>33M–47M-parameter</strong> UperNet decoders. UniverSat uses a single
      <strong>9K-parameter linear probe</strong> on top of its dense embeddings — 3700–5000× fewer supervised parameters —
      and still reaches or exceeds the state of the art on PASTIS-R and AI4Farms, including
      <em>configurations the model never saw at pretraining</em> (mono-temporal Sentinel inputs, the synthetic HLS sensor).
    </p>

    <div class="paper-figure" style="max-width: 575px; margin-left: auto; margin-right: auto;">
      <img src="/assets/publications/universat/Table3.png" alt="UniverSat PangaeaBench results" />
      <div class="paper-caption">Table 3: Probing with decoders on PangaeaBench. UniverSat uses a 9K-parameter linear probe versus 33M–47M-parameter UperNet decoders — yet reaches state-of-the-art on PASTIS-R and AI4Farms.</div>
    </div>

    <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; margin-top: 48px;">Hyperspectral — competitive without ever seeing EnMAP</h3>
    <p>
      On the SpectralEarth benchmark (EnMAP, up to 500 bands), UniverSat <strong>outperforms DOFA-L</strong> — a foundation model
      trained on EnMAP — across every task, and <strong>approaches SpectralEarth-L</strong>, a model specifically designed for EnMAP
      and trained with self-supervision on the evaluation data itself. <em>UniverSat was never trained on EnMAP.</em>
    </p>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Table4.png" alt="UniverSat hyperspectral results" />
      <div class="paper-caption">Table 4: Hyperspectral evaluation on the SpectralEarth / EnMAP benchmark — a sensor unseen at pretraining. UniverSat-B outperforms DOFA-L across every task and approaches the EnMAP-specialised SpectralEarth-L.</div>
    </div>
  </section>

  <hr class="divider"/>

  <!--
  <section class="fade-in">
    <div class="section-label">Ablation Study</div>
    <h2>Every design choice carries weight.</h2>
    <p>
      We ablate the four main design choices in a Tiny variant (<span class="inline-code">D=192</span>), trained on the full corpus and
      probed on one classification benchmark (m-Brick-Kiln) and two segmentation benchmarks (Sen1Floods11, PASTIS):
    </p>

    <div class="paper-figure paper-figure-reduced">
      <img src="/assets/publications/universat/Table5.png" alt="UniverSat ablation results" />
      <div class="paper-caption">Table 5: Ablation of the four main design choices. A: replacing the UPE with modality-specific MLPs. B: removing the skip connection, disabling resolution control, or using late fusion. C: removing the contrastive loss applied directly after the UPE.</div>
    </div>

    <div class="pillars">
      <div class="pillar">
        <div class="pillar-icon">A</div>
        <h3>UPE → MLPs</h3>
        <p>Replacing the UPE with modality-specific projectors increases parameters by 58%, ties the model to seen sensors, and drops performance noticeably.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">B</div>
        <h3>Skip / Output Res. / Fusion</h3>
        <p>The sub-patch skip connection is critical when fine spatial detail matters. Fixed output resolution hurts unseen datasets. Late fusion is both slower and weaker.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon">C</div>
        <h3>No contrastive loss</h3>
        <p>Dropping the UPE-level contrastive supervision degrades performance, especially for multimodal segmentation, by destabilising cross-modal alignment.</p>
      </div>
    </div>
  </section>

  <hr class="divider"/>
  -->

  <section class="fade-in">
    <div class="section-label">Embedding Quality</div>
    <h2>Sharper, modality-agnostic spatial features</h2>
    <p>
      Thanks to its controllable output resolution and sub-patch skip connection, UniverSat produces
      <strong>higher-resolution embeddings</strong> that preserve fine spatial structures — field boundaries, roads, parcel edges —
      compared to fixed-resolution backbones. PCA projections on a PASTIS test tile reveal markedly less <em>positional collapse</em>
      than other multimodal foundation models.
    </p>

    <div class="paper-figure">
      <img src="/assets/publications/universat/Figure8.png" alt="UniverSat embedding visualization" />
      <div class="paper-caption">Figure 8: Embedding visualization. PCA projections of features extracted from a multimodal PASTIS test tile (1.6 km²). UniverSat preserves field boundaries and fine spatial structures at higher granularity than competing multimodal models.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Contributions</div>
    <h2>What this paper delivers</h2>

    <ul class="contrib-list">
      <li>A <strong>unified ViT-like architecture</strong> for EO that processes heterogeneous sensors <em>without</em> modality-specific projectors or preprocessing.</li>
      <li>A <strong>multimodal self-supervised training framework</strong> combining cross-modal contrastive and latent multimodal masked modeling (LM₃).</li>
      <li><strong>Competitive performance</strong> across 15 datasets — from VHR RGB to radar time series to 500-band hyperspectral imagery.</li>
      <li><strong>Demonstrated generalisation</strong> to <em>unseen sensors and modality combinations</em> without input resampling.</li>
    </ul>
  </section>

  <hr class="divider"/>

  <section class="fade-in" id="citation">
    <div class="section-label">Citation</div>
    <h2>Cite Our Work</h2>

    <div class="bibtex-block">
      <button class="copy-btn" onclick="universatCopyBib()" aria-label="Copy bibtex">Copy BibTeX</button>
      <pre id="us-bib">@article{perron2026universat,
  title   = {UniverSat: Resolution- and Modality-Agnostic Transformers for Earth Observation},
  author  = {Perron, Yohann and Astruc, Guillaume and Gonthier, Nicolas
             and Mallet, Clement and Landrieu, Loic},
  journal = {arXiv preprint},
  year    = {2026}
}</pre>
    </div>
  </section>

  <footer class="universat-footer">
    <p>UniverSat &middot; arXiv preprint 2026</p>
    <p style="margin-top:6px;">Project page &middot; <a href="/" style="color:var(--us-accent); text-decoration:none;">Guillaume Astruc</a></p>
  </footer>
</div>

<script>
  const usObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.universat-page .fade-in').forEach((el) => usObserver.observe(el));

  function universatCopyBib() {
    const el = document.getElementById('us-bib');
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      const btn = document.querySelector('.universat-page .copy-btn');
      if (btn) btn.textContent = 'Copied';
      setTimeout(() => { if (btn) btn.textContent = 'Copy BibTeX'; }, 1500);
    });
  }

  function universatCopyCode(id) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      const btn = el.parentElement.querySelector('.copy-code-btn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }
    });
  }
</script>
