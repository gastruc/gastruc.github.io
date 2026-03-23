---
layout: project
permalink: /unigeoclip
title: "UNIGEOCLIP: Unified Geospatial Contrastive Learning"
short_name: UniGeoCLIP
author: Guillaume Astruc
description: "UNIGEOCLIP aligns text, aerial imagery, street-level views, DSMs, and geographic coordinates in a single unified embedding space via all-to-all contrastive learning."
keywords: remote sensing, geospatial, contrastive learning, multimodal learning, foundation model
analytics: https://www.googletagmanager.com/gtag/js?id=G-FLNC8B6RH9

paper_title: "UNIGEOCLIP: Unified Geospatial Contrastive Learning"
paper_authors: "Guillaume Astruc, Eduard Trulls, Jan Hosang, Loic Landrieu, Paul-Edouard Sarlin"
journal: EarthVision 2026
---

<script>
  // Force a consistent (light) visual theme for this page only.
  document.body.classList.remove('dark-theme');
  document.body.classList.add('unigeoclip-white');
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg: #ffffff;
    --surface: #f7fafc;
    --card: #ffffff;
    --border: rgba(0, 0, 0, 0.08);
    --accent: #3ec9e0;
    --accent2: #e8a23a;
    --text: #111827;
    --muted: #5b7280;
    --white: #0b1220;
  }

  body.unigeoclip-white {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* Hide the template header/footer; we provide our own "hero + sections". */
  body.unigeoclip-white .project-header { display: none !important; }
  body.unigeoclip-white #abstract { display: none !important; }
  body.unigeoclip-white footer:not(.unigeoclip-footer) { display: none !important; }
  body.unigeoclip-white #main { padding: 0 !important; margin-bottom: 0 !important; }
  body.unigeoclip-white #approach { padding: 0 !important; }

  .unigeoclip-page { position: relative; }

  /* HERO */
  .unigeoclip-page .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 92px 24px 60px;
    overflow: hidden;
  }

  .unigeoclip-page .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(62, 201, 224, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(232, 162, 58, 0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  .unigeoclip-page .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(62, 201, 224, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 201, 224, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .unigeoclip-page .venue-tag {
    display: inline-block;
    background: rgba(62, 201, 224, 0.1);
    border: 1px solid rgba(62, 201, 224, 0.3);
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }

  .unigeoclip-page h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 900;
    color: var(--white);
    line-height: 1.15;
    max-width: 900px;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
  }

  .unigeoclip-page h1 span { color: var(--accent); }

  .unigeoclip-page .subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 1rem;
    color: var(--muted);
    letter-spacing: 0.06em;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }

  .unigeoclip-page .authors {
    font-size: 1rem;
    color: var(--text);
    max-width: 700px;
    margin-bottom: 8px;
    line-height: 1.9;
    position: relative;
    z-index: 1;
  }

  .unigeoclip-page .authors a { color: var(--accent); text-decoration: none; }
  .unigeoclip-page .authors a:hover { text-decoration: underline; }

  .unigeoclip-page .affiliations {
    font-size: 0.82rem;
    color: var(--muted);
    margin-bottom: 40px;
    max-width: 680px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }

  .unigeoclip-page .btn-group { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }

  .unigeoclip-page .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }

  .unigeoclip-page .btn-primary { background: var(--accent); color: var(--bg); }
  .unigeoclip-page .btn-primary:hover { background: #6de0f0; transform: translateY(-2px); }

  .unigeoclip-page .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
  }
  .unigeoclip-page .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  .unigeoclip-page .scroll-hint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: var(--muted);
    font-size: 0.72rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    animation: unigeoclip-bob 2s ease-in-out infinite;
    z-index: 1;
    pointer-events: none;
  }
  @keyframes unigeoclip-bob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }

  /* SECTIONS */
  .unigeoclip-page section {
    max-width: 960px;
    margin: 0 auto;
    padding: 80px 24px;
  }

  .unigeoclip-page .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .unigeoclip-page h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700;
    color: var(--white);
    margin-bottom: 24px;
    line-height: 1.2;
  }

  .unigeoclip-page p { margin-bottom: 18px; font-size: 1.05rem; }
  .unigeoclip-page strong { color: var(--white); }

  .unigeoclip-page .divider {
    max-width: 960px;
    margin: 0 auto;
    border: none;
    border-top: 1px solid var(--border);
  }

  .unigeoclip-page .figure-hint {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(62, 201, 224, 0.05);
    border: 1px solid rgba(62, 201, 224, 0.2);
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 18px 22px;
    margin: 28px 0;
    font-size: 0.9rem;
  }

  .unigeoclip-page .figure-hint .fig-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
  .unigeoclip-page .figure-hint strong {
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 4px;
  }

  .unigeoclip-page .paper-figure {
    margin: 24px 0 10px;
    text-align: center;
  }

  .unigeoclip-page .paper-figure img {
    width: 100%;
    max-width: 1100px;
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }

  .unigeoclip-page .paper-caption {
    margin-top: 10px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    line-height: 1.5;
  }

  .unigeoclip-page .paper-fig-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
    margin: 18px 0 6px;
  }

  .unigeoclip-page .paper-fig-grid .paper-figure img {
    max-width: 100%;
  }

  .unigeoclip-page .modality-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 32px 0;
  }

  .unigeoclip-page .modality-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 40px;
    padding: 8px 18px;
    font-size: 0.9rem;
    color: var(--text);
    transition: border-color 0.2s;
  }

  .unigeoclip-page .modality-pill:hover { border-color: var(--accent); }
  .unigeoclip-page .modality-pill .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .unigeoclip-page .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    margin-top: 36px;
  }

  .unigeoclip-page .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .unigeoclip-page .card:hover { border-color: var(--accent); transform: translateY(-3px); }
  .unigeoclip-page .card-icon { font-size: 1.8rem; margin-bottom: 14px; }
  .unigeoclip-page .card h3 { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; color: var(--white); margin-bottom: 10px; }
  .unigeoclip-page .card p { font-size: 0.9rem; color: var(--muted); margin: 0; line-height: 1.6; }

  .unigeoclip-page .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin: 36px 0;
  }

  .unigeoclip-page .result-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px 20px;
    text-align: center;
  }

  .unigeoclip-page .result-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 900;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 8px;
  }

  .unigeoclip-page .result-label {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.4;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.04em;
  }

  .unigeoclip-page .compare-table {
    width: 100%;
    border-collapse: collapse;
    margin: 28px 0;
    font-size: 0.9rem;
  }

  .unigeoclip-page .compare-table th {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }

  .unigeoclip-page .compare-table td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(96, 180, 200, 0.07);
    color: var(--text);
  }

  .unigeoclip-page .compare-table tr.ours td { color: var(--white); font-weight: 500; }
  .unigeoclip-page .compare-table tr.ours td:first-child {
    color: var(--accent);
    font-family: 'DM Mono', monospace;
  }
  .unigeoclip-page .compare-table .best { color: var(--accent2); font-weight: 500; }

  .unigeoclip-page .insight {
    border-left: 3px solid var(--accent2);
    padding: 20px 28px;
    margin: 32px 0;
    background: rgba(232, 162, 58, 0.04);
    border-radius: 0 8px 8px 0;
    font-size: 1.05rem;
    color: var(--text);
    font-style: italic;
  }
  .unigeoclip-page .insight cite {
    display: block;
    margin-top: 10px;
    font-style: normal;
    font-size: 0.82rem;
    color: var(--accent2);
    font-family: 'DM Mono', monospace;
  }

  .unigeoclip-page .bibtex-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px;
    position: relative;
  }

  .unigeoclip-page .bibtex-block pre {
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    color: var(--muted);
    white-space: pre-wrap;
    line-height: 1.8;
  }

  .unigeoclip-page .copy-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.06em;
  }

  .unigeoclip-page .copy-btn:hover { color: var(--accent); border-color: var(--accent); }

  .unigeoclip-page footer.unigeoclip-footer {
    text-align: center;
    padding: 40px 24px;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.82rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.06em;
  }

  .unigeoclip-page .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .unigeoclip-page .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    .unigeoclip-page section { padding: 60px 20px; }
    .unigeoclip-page .cards { grid-template-columns: 1fr; }
    .unigeoclip-page .results-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>

<div class="unigeoclip-page">
  <div class="hero">
    <div class="grid-bg"></div>
    <div class="venue-tag">EarthVision 2026</div>
    <h1>Uni<span>Geo</span>CLIP</h1>
    <p class="subtitle">Unified Geospatial Contrastive Learning</p>
    <p class="authors">
      Guillaume Astruc&nbsp;&middot;&nbsp;Eduard Trulls&nbsp;&middot;&nbsp;Jan Hosang&nbsp;&middot;&nbsp;Loic Landrieu&nbsp;&middot;&nbsp;Paul-Edouard Sarlin
    </p>
    <p class="affiliations">
      LASTIG, Univ Gustave Eiffel&nbsp;|&nbsp;IGN&nbsp;|&nbsp;ENSG&nbsp;|&nbsp;CNES&nbsp;|&nbsp;LIGM, Ecole des Ponts ParisTech&nbsp;|&nbsp;Google Switzerland
    </p>

    <div class="btn-group">
      <a class="btn btn-primary" href="/UniGeoCLIP___EARTHVISION2026-6.pdf" target="_blank" rel="noopener">📄 Paper</a>
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
    <h2>Five Modalities, One Unified Space</h2>
    <p>
      Geospatial understanding requires reasoning across fundamentally different kinds of data -- a satellite view from above,
      a street photo at ground level, a 3D elevation map, a text description of a neighborhood, and a pair of GPS coordinates.
      These modalities are complementary: each one captures something the others miss.
    </p>
    <p>
      <strong>UniGeoCLIP</strong> is the first contrastive framework to jointly align all five modalities into a single
      unified embedding space, enabling seamless retrieval and reasoning across any combination of inputs, without relying on
      a privileged "pivot" modality.
    </p>

    <div class="modality-grid">
      <div class="modality-pill"><div class="dot" style="background:#3ec9e0"></div> Aerial imagery</div>
      <div class="modality-pill"><div class="dot" style="background:#e8a23a"></div> Street-level imagery</div>
      <div class="modality-pill"><div class="dot" style="background:#6ecf85"></div> Elevation (DSM)</div>
      <div class="modality-pill"><div class="dot" style="background:#b57bee"></div> Text descriptions</div>
      <div class="modality-pill"><div class="dot" style="background:#e05a5a"></div> GPS coordinates</div>
    </div>

    <div class="figure-hint">
      <div class="fig-icon">📌</div>
      <div>
        <strong>-> Figure 1</strong>
        The all-to-all connectivity diagram showing bidirectional arrows between all five modalities.
      </div>
    </div>

    <div class="paper-figure paper-figure-white paper-figure-small">
      <img
        src="/assets/publications/unigeoclip/Figure1.png"
        alt="UniGeoCLIP Figure 1"
        style="max-width: 320px; width: 100%; height: auto; display: inline-block;"
      />
      <div class="paper-caption">Figure 1: Unified contrastive learning of geospatial modalities (all-to-all).</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Key Innovation</div>
    <h2>All-to-All, Not Pivot-Centric</h2>
    <p>
      Prior multimodal contrastive models like ImageBind and UniBind rely on a central pivot. This creates an asymmetry and
      forces cross-modal retrieval between two non-image inputs to pass through the pivot.
    </p>
    <p>
      UniGeoCLIP takes a fundamentally different approach: every modality is directly contrasted against every other modality
      via a multi-way InfoNCE objective summed over all ordered modality pairs. Text, DSM, aerial imagery, street views and
      coordinates are all primary citizens in the same latent space.
    </p>

    <div class="cards">
      <div class="card">
        <div class="card-icon">🔗</div>
        <h3>All-to-All Alignment</h3>
        <p>Contrastive loss over all M^2 ordered pairs.</p>
      </div>
      <div class="card">
        <div class="card-icon">🌍</div>
        <h3>Modality-Invariant Geography</h3>
        <p>Same location, any modality -> nearby embeddings.</p>
      </div>
      <div class="card">
        <div class="card-icon">🔄</div>
        <h3>Zero-Shot Cross-Modal Retrieval</h3>
        <p>Query with one modality, retrieve another without task-specific heads.</p>
      </div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Training Data</div>
    <h2>Co-located Five-Modality Data</h2>
    <p>
      Training spans continental USA metropolitan centers with uniform spatial coverage using S2 cells at level L=16.
      The paper reports ~800k S2 cells, sampling up to 120 street-level panoramas per cell with a minimum 40m separation.
      To prevent temporal leakage, all data from 2023 is held out for evaluation.
    </p>

    <div class="figure-hint">
      <div class="fig-icon">🗺️</div>
      <div>
        <strong>-> Figure 2</strong>
        A representative sample showing the five co-registered modalities at the same geographic location.
      </div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/unigeoclip/Figure2.png" alt="UniGeoCLIP Figure 2" />
      <div class="paper-caption">Figure 2: Example location represented through aerial, street-level, DSM, text, and GPS.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Architecture</div>
    <h2>A Scaled Coordinate Encoder That Actually Understands Space</h2>
    <p>
      Raw latitude/longitude coordinates contain rich structure, but require an encoder that models geographic dependencies
      across multiple scales. UniGeoCLIP introduces a scaled latitude-longitude encoder built with:
      Equal Earth projection, multi-frequency random Fourier features, and cross-scale self-attention over frequency tokens.
    </p>

    <div class="insight">
      "At depth 0, the encoder reduces to fixed random Fourier features (coordinate retrieval is low). With 12 self-attention
      blocks, coordinate retrieval rises and multimodal ensembling improves substantially."
      <cite>-- Ablation Study, Table 5</cite>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/unigeoclip/Table5.png" alt="UniGeoCLIP Table 5" />
      <div class="paper-caption">Table 5: Ablation on the number of blocks in the location (GPS) encoder.</div>
    </div>

    <div class="figure-hint">
      <div class="fig-icon">⚙️</div>
      <div>
        <strong>-> Figure 3</strong>
        Multi-scale coordinate encoder: K Fourier projections -> tokens -> self-attention -> pooled embedding.
      </div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/unigeoclip/Figure3.png" alt="UniGeoCLIP Figure 3" />
      <div class="paper-caption">Figure 3: Multi-scale coordinate encoder pipeline (Fourier scales -> tokens -> attention -> pooling).</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Results</div>
    <h2>State-of-the-Art Across Every Geospatial Task</h2>
    <p>
      We evaluate UniGeoCLIP on cross-modal street-view retrieval, satellite image encoding (solar panels, land cover),
      spatial coordinate regression (health/socio-economic/environment indicators), and DSM understanding.
    </p>

    <div class="results-grid">
      <div class="result-box">
        <div class="result-num">88.2%</div>
        <div class="result-label">Acc@100m<br/>SV -> Aerial (full model)</div>
      </div>
      <div class="result-box">
        <div class="result-num">97.0%</div>
        <div class="result-label">Overall Accuracy<br/>m-pv4ger solar panels</div>
      </div>
      <div class="result-box">
        <div class="result-num">57.0</div>
        <div class="result-label">Mean R^2<br/>27 regression tasks</div>
      </div>
      <div class="result-box">
        <div class="result-num">72.0%</div>
        <div class="result-label">Accuracy<br/>DSM land-cover (MDAS)</div>
      </div>
    </div>

    <h3 style="color:var(--white); font-size:1.1rem; margin:36px 0 16px; font-family:'DM Sans',sans-serif;">
      Cross-View Retrieval vs. Baselines
    </h3>

    <table class="compare-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>SV -> Aerial</th>
          <th>SV -> GPS</th>
          <th>Multimodal Ens.</th>
          <th>OOD (Amsterdam)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GeoCLIP (retrained)</td>
          <td>--</td>
          <td>24.6</td>
          <td>--</td>
          <td>4.5</td>
        </tr>
        <tr>
          <td>ScalingGeoloc</td>
          <td>45.8</td>
          <td>--</td>
          <td>--</td>
          <td class="best">56.9</td>
        </tr>
        <tr class="ours">
          <td>UniGeoCLIP</td>
          <td class="best">88.2</td>
          <td class="best">69.4</td>
          <td class="best">91.0</td>
          <td>41.2</td>
        </tr>
      </tbody>
    </table>

    <div class="figure-hint">
      <div class="fig-icon">📊</div>
      <div>
        <strong>-> Tables 1-4</strong>
        This page summarizes the key numeric results reported in the paper.
      </div>
    </div>

    <div class="paper-fig-grid">
      <div class="paper-figure">
        <img src="/assets/publications/unigeoclip/Table1.png" alt="UniGeoCLIP Table 1" />
        <div class="paper-caption">Table 1: Cross-modal street-view retrieval (Acc@100m).</div>
      </div>
      <div class="paper-figure">
        <img src="/assets/publications/unigeoclip/Table2.png" alt="UniGeoCLIP Table 2" />
        <div class="paper-caption">Table 2: Aerial/satellite encoder transfer (solar panels + land cover).</div>
      </div>
      <div class="paper-figure">
        <img src="/assets/publications/unigeoclip/Table3.png" alt="UniGeoCLIP Table 3" />
        <div class="paper-caption">Table 3: Location encoder downstream regression (mean R^2).</div>
      </div>
      <div class="paper-figure">
        <img src="/assets/publications/unigeoclip/Table4.png" alt="UniGeoCLIP Table 4" />
        <div class="paper-caption">Table 4: DSM encoder evaluation on MDAS (DSM-only segmentation).</div>
      </div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Visualizations</div>
    <h2>Semantically Structured Geographic Representations</h2>
    <p>
      The learned embedding space is not only accurate; it is also structured. When applying PCA over a dense grid in Manhattan,
      UniGeoCLIP produces spatial patterns reflecting underlying urban structure (for example, Central Park stands out).
    </p>
    <p>
      In contrast, SatCLIP and GeoCLIP exhibit smoother, predominantly position-driven gradients.
      UniGeoCLIP learns what a place means, not just where it is.
    </p>

    <div class="figure-hint">
      <div class="fig-icon">🎨</div>
      <div>
        <strong>-> Figure 5</strong>
        PCA visualization of coordinate embeddings over Manhattan.
      </div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/unigeoclip/Figure5.png" alt="UniGeoCLIP Figure 5" />
      <div class="paper-caption">Figure 5: PCA projection of coordinate embeddings over Manhattan.</div>
    </div>

    <div class="figure-hint">
      <div class="fig-icon">🔵</div>
      <div>
        <strong>-> Figure 6</strong>
        t-SNE scatter plot validating co-location of embeddings from all five modalities.
      </div>
    </div>

    <div class="paper-figure">
      <img src="/assets/publications/unigeoclip/Figure6.png" alt="UniGeoCLIP Figure 6" />
      <div class="paper-caption">Figure 6: t-SNE visualization showing modality embeddings cluster by location.</div>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in">
    <div class="section-label">Generalization</div>
    <h2>Trained in the USA. Works in Amsterdam.</h2>
    <p>
      UniGeoCLIP is trained exclusively on US metropolitan areas, yet achieves 41.2% Acc@100m on an out-of-distribution
      Amsterdam evaluation set under a substantial domain shift. The paper reports consistent performance trends:
      adding modalities helps, and multimodal ensembling remains beneficial.
    </p>

    <div class="insight">
      "The model trained solely with aerial and street view achieves the strongest OOD performance, while the full multimodal
      model remains competitive."
      <cite>-- Section 4.4</cite>
    </div>
  </section>

  <hr class="divider"/>

  <section class="fade-in" id="citation">
    <div class="section-label">Citation</div>
    <h2>Cite Our Work</h2>

    <div class="bibtex-block">
      <button class="copy-btn" onclick="unigeoclipCopyBib()" aria-label="Copy bibtex">Copy BibTeX</button>
      <pre id="bib">@inproceedings{astruc2026unigeoclip,
  title     = {UNIGEOCLIP: Unified Geospatial Contrastive Learning},
  author    = {Astruc, Guillaume and Trulls, Eduard and Hosang, Jan and Landrieu, Loic and Sarlin, Paul-Edouard},
  booktitle = {EarthVision},
  year      = {2026}
}</pre>
    </div>
  </section>

  <footer class="unigeoclip-footer">
    <p>UniGeoCLIP &middot; EarthVision 2026</p>
    <p style="margin-top:6px;">Academic dissemination page</p>
  </footer>
</div>

<script>
  // Fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.unigeoclip-page .fade-in').forEach((el) => observer.observe(el));

  function unigeoclipCopyBib() {
    const el = document.getElementById('bib');
    if (!el) return;
    const text = el.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.unigeoclip-page .copy-btn');
      if (btn) btn.textContent = 'Copied';
      setTimeout(() => {
        if (btn) btn.textContent = 'Copy BibTeX';
      }, 1500);
    });
  }
</script>

