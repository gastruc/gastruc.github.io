---
layout: project
permalink: /geoselect
title: "GeoSelect: Less Is More, Semantic Curation of Earth Observation Data for Self-Supervised Learning"
short_name: GeoSelect
author: Guillaume Astruc
description: "GeoSelect is a simple, training-free semantic curation method for Earth-observation archives. Pretraining on the 1% of Major-TOM it selects beats pretraining on all of it."
keywords: remote sensing, earth observation, data curation, semantic deduplication, self-supervised learning, foundation model, Sentinel-2, Major-TOM, SemDeDup, GeoSelect
analytics: https://www.googletagmanager.com/gtag/js?id=G-FLNC8B6RH9
css: /assets/publications/geoselect/geoselect.css?v=20261123b
nav:
  - { title: "Overview", href: "#overview" }
  - { title: "Idea", href: "#idea" }
  - { title: "Method", href: "#method" }
  - { title: "Protocol", href: "#protocol" }
  - { title: "Results", href: "#results" }
  - { title: "What is kept", href: "#selection" }
  - { title: "S2-NAIP", href: "#s2naip" }
  - { title: "Cost", href: "#efficiency" }
  - { title: "Cite", href: "#citation" }

paper_title: "Less Is More: Semantic Curation of Earth Observation Data for Self-Supervised Learning"
paper_authors: "<a href=\"/\">Guillaume Astruc</a>, <a href=\"https://ngonthier.github.io/\">Nicolas Gonthier</a>, <a href=\"https://www.umr-lastig.fr/clement-mallet/\">Clement Mallet</a>, <a href=\"https://loiclandrieu.com/\">Loic Landrieu</a>"
journal: arXiv preprint, 2026
---
<!-- TODO before publishing: arXiv link (hero button + BibTeX), public code / keep-list URLs,
     author list and affiliations (copied from the previous version of this page). -->
<script>document.body.classList.add('gs-body'); document.documentElement.classList.add('gs-js');</script>

<div class="gs-page">
  <div class="gs-progress" aria-hidden="true"><span></span></div>

  <div class="gs-spy" role="navigation" aria-label="Page sections">
    <a href="#overview"><span>Overview</span></a>
    <a href="#idea"><span>Idea</span></a>
    <a href="#method"><span>Method</span></a>
    <a href="#protocol"><span>Protocol</span></a>
    <a href="#results"><span>Results</span></a>
    <a href="#selection"><span>What is kept</span></a>
    <a href="#s2naip"><span>S2-NAIP</span></a>
    <a href="#efficiency"><span>Cost</span></a>
    <a href="#citation"><span>Cite</span></a>
  </div>

  <!-- ============================== HERO ============================== -->
  <header class="gs-hero" id="gs-hero">
    <canvas class="gs-hero-canvas" aria-hidden="true"></canvas>
    <div class="gs-hero-scrim" aria-hidden="true"></div>
    <div class="gs-hero-inner">
      <div class="gs-chip"><i></i>arXiv preprint &middot; 2026</div>
      <h1 class="gs-title">Geo<span>Select</span></h1>
      <p class="gs-subtitle">Less Is More: Semantic Curation of Earth Observation Data for Self-Supervised Learning</p>
      <p class="gs-tagline">Pretrain on <b>1%</b> of a global Sentinel-2 archive, and get <em>better</em> representations than with all of it.</p>
      <p class="gs-authors">
        <a href="/">Guillaume Astruc</a> <span>&middot;</span> <a href="https://ngonthier.github.io/">Nicolas Gonthier</a> <span>&middot;</span> <a href="https://www.umr-lastig.fr/clement-mallet/">Clement Mallet</a> <span>&middot;</span> <a href="https://loiclandrieu.com/">Loic Landrieu</a>
      </p>
      <p class="gs-affil">LASTIG, Univ Gustave Eiffel, IGN, ENSG &nbsp;|&nbsp; CNES &nbsp;|&nbsp; LIGM, ENPC, IP Paris</p>
      <div class="gs-btns">
        <!-- TODO: arXiv link -->
        <a class="gs-btn gs-btn-primary" href="#" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>Paper</a>
        <!-- TODO: public code URL -->
        <a class="gs-btn" href="https://github.com/gastruc/Dedup" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>Code</a>
        <a class="gs-btn" href="#efficiency">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h12"/></svg>Curated subsets</a>
        <a class="gs-btn" href="#citation">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h4v4H7zM13 7h4v4h-4zM7 11c0 3-1 5-3 6M13 11c0 3-1 5-3 6"/></svg>BibTeX</a>
      </div>
    </div>
    <div class="gs-hero-counter" aria-live="off">
      <span class="gs-hc-label">Major-TOM Core-S2L2A</span>
      <span class="gs-hc-num" id="gs-hero-count">2,238,687</span>
      <span class="gs-hc-state" id="gs-hero-state">tiles in the archive</span>
    </div>
    <a class="gs-scroll" href="#overview" aria-label="Scroll to overview"><span></span></a>
  </header>

  <!-- ============================== OVERVIEW ============================== -->
  <section class="gs-section" id="overview">
    <div class="gs-kicker gs-reveal">Overview</div>
    <h2 class="gs-reveal">A hundred times less data. Better representations.</h2>
    <div class="gs-two gs-reveal">
      <p class="gs-lead">
        Earth-observation foundation models are pretrained on huge satellite archives with substantial redundancy:
        spatial autocorrelation and vast homogeneous regions such as oceans, ice sheets, deserts and closed forests.
        These archives are usually sampled with hand-designed geographic or metadata rules, and rarely curated
        <em>semantically</em>.
      </p>
      <p class="gs-lead">
        <b>GeoSelect</b> is a simple, training-free curation method. In a single pass over the features of a frozen EO
        foundation model, it selects a fixed-size subset that is diverse at two levels: <b>across</b> observations, and
        <b>within</b> each observation. Pretraining on the 1% it keeps beats pretraining on the whole archive, and the same recipe
        <a href="#s2naip">transfers to a regional, multi-temporal archive of 302M images</a>.
      </p>
    </div>

    <div class="gs-stats">
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-from="100" data-to="1" data-dec="0">1</span><small>%</small></div><div class="gs-stat-lbl">of Major-TOM kept<br><span>&asymp;22k of 2.24M tiles</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><small>+</small><span class="gs-count" data-to="2.4" data-dec="1">2.4</span></div><div class="gs-stat-lbl">points in classification<br><span>vs. the full archive</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><small>+</small><span class="gs-count" data-to="2.2" data-dec="1">2.2</span></div><div class="gs-stat-lbl">mIoU in segmentation<br><span>vs. the full archive</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-from="1" data-to="100" data-dec="0">100</span><small>&times;</small></div><div class="gs-stat-lbl">less storage and transfer<br><span>21&nbsp;TB &rarr; 0.2&nbsp;TB</span></div></div>
    </div>

    <div class="gs-card gs-reveal" id="gs-race">
      <div class="gs-card-head">
        <div>
          <h3>Every curation strategy, at the same 1% budget</h3>
          <p class="gs-card-sub">Mean GEO-Bench linear-probe score relative to pretraining on the full archive.</p>
        </div>
        <div class="gs-seg" role="tablist" aria-label="Task group">
          <button role="tab" aria-selected="true" data-k="all">All 10 tasks</button>
          <button role="tab" aria-selected="false" data-k="cls">Classification</button>
          <button role="tab" aria-selected="false" data-k="seg">Segmentation</button>
        </div>
      </div>
      <div class="gs-race-legend">
        <span><i class="c-geo"></i>Geographic prior</span>
        <span><i class="c-meta"></i>Metadata stratification</span>
        <span><i class="c-sem"></i>Semantic curation</span>
        <span><i class="c-ours"></i>GeoSelect</span>
      </div>
      <div class="gs-race" aria-label="Bar chart of gains over the full archive"></div>
      <p class="gs-note">Each subset keeps 1% of Major-TOM (&asymp;22k tiles, 0.2&nbsp;TB of 21&nbsp;TB). A ViT-B is pretrained from scratch with MAE on each subset under the same compute budget, then evaluated frozen by linear probing on 5 classification and 5 segmentation tasks. The zero line is the same model pretrained on all 2.2M tiles.</p>
    </div>
  </section>

  <!-- ============================== IDEA ============================== -->
  <section class="gs-section gs-alt" id="idea">
    <div class="gs-kicker gs-reveal">The idea</div>
    <h2 class="gs-reveal">Two kinds of redundancy.</h2>
    <div class="gs-two gs-reveal">
      <div class="gs-idea">
        <div class="gs-idea-ico gs-ico-nd">&asymp;</div>
        <div>
          <h4>Global diversity, across observations</h4>
          <p>Large archives contain many observations with essentially the same content. Keeping all of them spends the
          budget twice on the same thing. GeoSelect penalises observations that are already represented by a richer one.</p>
        </div>
      </div>
      <div class="gs-idea">
        <div class="gs-idea-ico gs-ico-un">U</div>
        <div>
          <h4>Local diversity, within each observation</h4>
          <p>At Sentinel-2 resolution, forests, deserts or fields can look nearly uniform over 10&times;10&nbsp;km. Such
          tiles give a weak self-supervised signal: two crops of them look alike, and masked regions are easy to inpaint.</p>
        </div>
      </div>
    </div>

    <div class="gs-trips" id="gs-trips">
      <figure class="gs-trip gs-reveal">
        <div class="gs-trip-main">
          <img src="/assets/publications/geoselect/tiles/teaser_des_k.webp" width="256" height="256" alt="Kept desert tile with a river" loading="lazy">
          <span class="gs-badge gs-badge-keep">kept</span>
          <span class="gs-trip-meta">local diversity: 84th pct.</span>
        </div>
        <div class="gs-trip-side">
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_des_nd.webp" width="256" height="256" alt="Discarded near-duplicate desert tile" loading="lazy">
            <span class="gs-stamp">&asymp;</span>
            <span class="gs-trip-meta">cos 0.995 to kept<br>near-duplicate</span>
          </div>
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_des_un.webp" width="256" height="256" alt="Discarded uniform desert tile" loading="lazy">
            <span class="gs-stamp">U</span>
            <span class="gs-trip-meta">local diversity: 2nd pct.<br>uniform</span>
          </div>
        </div>
        <figcaption>Desert</figcaption>
      </figure>
      <figure class="gs-trip gs-reveal">
        <div class="gs-trip-main">
          <img src="/assets/publications/geoselect/tiles/teaser_for_k.webp" width="256" height="256" alt="Kept forest tile crossed by a river" loading="lazy">
          <span class="gs-badge gs-badge-keep">kept</span>
          <span class="gs-trip-meta">local diversity: 98th pct.</span>
        </div>
        <div class="gs-trip-side">
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_for_nd.webp" width="256" height="256" alt="Discarded near-duplicate forest tile" loading="lazy">
            <span class="gs-stamp">&asymp;</span>
            <span class="gs-trip-meta">cos 0.991 to kept<br>near-duplicate</span>
          </div>
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_for_un.webp" width="256" height="256" alt="Discarded uniform closed-canopy forest tile" loading="lazy">
            <span class="gs-stamp">U</span>
            <span class="gs-trip-meta">local diversity: 3rd pct.<br>uniform</span>
          </div>
        </div>
        <figcaption>Forest</figcaption>
      </figure>
      <figure class="gs-trip gs-reveal">
        <div class="gs-trip-main">
          <img src="/assets/publications/geoselect/tiles/teaser_crop_k.webp" width="256" height="256" alt="Kept cropland tile with a town" loading="lazy">
          <span class="gs-badge gs-badge-keep">kept</span>
          <span class="gs-trip-meta">local diversity: 96th pct.</span>
        </div>
        <div class="gs-trip-side">
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_crop_nd.webp" width="256" height="256" alt="Discarded near-duplicate cropland tile" loading="lazy">
            <span class="gs-stamp">&asymp;</span>
            <span class="gs-trip-meta">cos 0.995 to kept<br>near-duplicate</span>
          </div>
          <div class="gs-trip-drop">
            <img src="/assets/publications/geoselect/tiles/teaser_crop_un.webp" width="256" height="256" alt="Discarded uniform cropland tile" loading="lazy">
            <span class="gs-stamp">U</span>
            <span class="gs-trip-meta">local diversity: 19th pct.<br>uniform</span>
          </div>
        </div>
        <figcaption>Cropland</figcaption>
      </figure>
    </div>
    <p class="gs-note gs-center gs-reveal">Real Major-TOM tiles. <b class="t-keep">Kept</b> by GeoSelect at 1%; <b class="t-drop">discarded</b>: <b>&asymp;</b> near-duplicate of the kept tile (global redundancy), <b>U</b> similar content but internally uniform (local redundancy). Cosines are between UniverSat embeddings; percentiles are of local diversity over the archive.</p>
  </section>

  <!-- ============================== METHOD ============================== -->
  <section class="gs-section" id="method">
    <div class="gs-kicker gs-reveal">Method</div>
    <h2 class="gs-reveal">Measure both diversities. Select under a budget.</h2>
    <p class="gs-lead gs-reveal gs-narrow">
      Each observation is embedded once by a frozen EO foundation model (UniverSat) into \(T\) patch tokens; their mean is its
      global embedding \(f_i\). GeoSelect outputs <em>observation identifiers only</em>: the subset can then pretrain any
      architecture, with any objective, and even another sensor.
    </p>

    <!-- Step 1: local diversity -->
    <div class="gs-step">
      <div class="gs-step-text gs-reveal">
        <div class="gs-step-num">1</div>
        <h3>Local diversity: how much the patch tokens vary</h3>
        <p>We measure the dispersion of the patch tokens with a diagonal approximation of the MCR&sup2; coding rate. Each feature is
        normalised by its typical variation across the archive, \(\epsilon_d\).</p>
        <div class="gs-eq">\[ L_i = \frac{1}{2}\sum_{d=1}^{D}\log\!\left(1+\frac{\sigma_{i,d}^2}{\epsilon_d^2}\right) \]</div>
        <p class="gs-small">\(\sigma_{i,d}^2\): variance of feature \(d\) over the tokens of observation \(i\); \(\epsilon_d\): median of \(\sigma_{j,d}\) over the archive.</p>
        <p>Drag the slider across the archive: uniform water, sand and closed canopy give near-constant tokens; fields,
        rivers, reservoirs, coastlines and relief give varied ones.</p>
      </div>
      <div class="gs-step-vis gs-reveal">
        <div class="gs-card gs-spec" id="gs-spec">
          <div class="gs-spec-views">
            <div class="gs-wipe" data-pair="0">
              <img class="gs-wipe-a" alt="Sentinel-2 tile" width="320" height="320">
              <img class="gs-wipe-b" alt="Patch-token map of the same tile" width="320" height="320">
              <div class="gs-wipe-handle"><span></span></div>
              <span class="gs-wipe-lbl l">image</span><span class="gs-wipe-lbl r">patch tokens</span>
            </div>
            <div class="gs-wipe" data-pair="1">
              <img class="gs-wipe-a" alt="Sentinel-2 tile" width="320" height="320">
              <img class="gs-wipe-b" alt="Patch-token map of the same tile" width="320" height="320">
              <div class="gs-wipe-handle"><span></span></div>
              <span class="gs-wipe-lbl l">image</span><span class="gs-wipe-lbl r">patch tokens</span>
            </div>
          </div>
          <div class="gs-spec-ctrl">
            <div class="gs-spec-read">Percentile of \(L_i\) in the archive: <b id="gs-spec-p">0.5</b></div>
            <div class="gs-spec-track">
              <div class="gs-spec-strip" aria-hidden="true"></div>
              <input type="range" min="0" max="7" step="1" value="0" aria-label="Percentile of local diversity">
            </div>
            <div class="gs-spec-ticks" aria-hidden="true"><span>0.5</span><span>10</span><span>25</span><span>50</span><span>75</span><span>90</span><span>97</span><span>99.5</span></div>
          </div>
          <p class="gs-note">Token maps: UniverSat patch tokens (240&nbsp;m patches), normalised by \(\epsilon_d\), centred on each tile's mean token and projected on three principal components with one shared colour scale.</p>
        </div>
      </div>
    </div>

    <!-- Step 2: global diversity -->
    <div class="gs-step gs-step-rev">
      <div class="gs-step-text gs-reveal">
        <div class="gs-step-num">2</div>
        <h3>Global diversity: distance to a richer look-alike</h3>
        <p>We partition the global embeddings into semantic clusters with \(k\)-means and compare observations within a
        cluster. Like SemDeDup, each observation is compared with those that precede it in an ordering. Unlike SemDeDup,
        which orders by distance to the cluster centroid, we order by <b>decreasing local diversity</b>:</p>
        <div class="gs-eq">\[ G_i = 1-\max_{j:\;c(j)=c(i),\;L_j>L_i}\cos\left(f_i,f_j\right) \]</div>
        <p>When two observations show essentially the same content, the less locally diverse one gets a small \(G_i\). Run the
        toy cluster with both orderings to see which member of each look-alike pair survives.</p>
      </div>
      <div class="gs-step-vis gs-reveal">
        <div class="gs-card gs-toy" id="gs-toy">
          <div class="gs-card-head gs-card-head-tight">
            <div class="gs-seg" role="tablist" aria-label="Ordering">
              <button role="tab" aria-selected="false" data-k="sdd">SemDeDup order</button>
              <button role="tab" aria-selected="true" data-k="geo">GeoSelect order</button>
            </div>
            <button class="gs-ghost" data-act="replay" aria-label="Replay"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>Replay</button>
          </div>
          <svg class="gs-toy-svg" viewBox="0 0 600 400" role="img" aria-label="Toy semantic cluster in embedding space"></svg>
          <div class="gs-toy-foot">
            <div class="gs-toy-legend">
              <span><i class="dot-s"></i><i class="dot-l"></i>size = local diversity \(L_i\)</span>
              <span><i class="ring-keep"></i>kept</span>
              <span><i class="link"></i>closest earlier observation</span>
            </div>
            <div class="gs-toy-score" aria-live="polite"></div>
          </div>
          <p class="gs-note">Toy illustration (synthetic 2-D cluster, Euclidean distance in place of cosine). Both orderings keep the same number of points; the ordering decides which member of each look-alike pair is kept.</p>
        </div>
      </div>
    </div>

    <!-- Step 3: allocation -->
    <div class="gs-step">
      <div class="gs-step-text gs-reveal">
        <div class="gs-step-num">3</div>
        <h3>Allocate the budget across clusters</h3>
        <p>Clusters full of near-duplicates should receive fewer slots than clusters of distinct observations. We reuse the
        SemDeDup redundancy \(m_i\) (closest earlier observation, centroid ordering) and pick one global threshold \(\tau_B\)
        such that exactly \(B\) observations pass it. Each cluster's budget is its count of passing observations:</p>
        <div class="gs-eq">\[ B_c = \bigl|\{\, i : c(i)=c,\; m_i\le\tau_B \,\}\bigr|,\qquad \textstyle\sum_c B_c = B \]</div>
        <p>The real clusters on the right are paired by content: one receives a single slot for hundreds of near-identical
        tiles, its look-alike keeps 18% to 56% of its tiles. Over a third of the budget goes to the tenth of clusters with the largest share.</p>
      </div>
      <div class="gs-step-vis gs-reveal">
        <div class="gs-card gs-alloc" id="gs-alloc">
          <div class="gs-seg gs-seg-wrap" role="tablist" aria-label="Cluster pair">
            <button role="tab" aria-selected="true" data-k="0">Sea &middot; coasts</button>
            <button role="tab" aria-selected="false" data-k="1">Ice &middot; relief</button>
            <button role="tab" aria-selected="false" data-k="2">Rainforest &middot; rivers</button>
            <button role="tab" aria-selected="false" data-k="3">Sand &middot; desert coasts</button>
          </div>
          <div class="gs-alloc-grid">
            <div class="gs-alloc-side" data-side="low">
              <div class="gs-alloc-hd"><span class="gs-alloc-name"></span><span class="gs-alloc-share"></span></div>
              <div class="gs-alloc-nums"></div>
              <canvas class="gs-waffle" aria-hidden="true"></canvas>
              <div class="gs-alloc-tiles"></div>
            </div>
            <div class="gs-alloc-side" data-side="high">
              <div class="gs-alloc-hd"><span class="gs-alloc-name"></span><span class="gs-alloc-share"></span></div>
              <div class="gs-alloc-nums"></div>
              <canvas class="gs-waffle" aria-hidden="true"></canvas>
              <div class="gs-alloc-tiles"></div>
            </div>
          </div>
          <p class="gs-note">Real clusters of the 1% GeoSelect run. Each square is one tile of the cluster; lit squares are its budget \(B_c\). Below: left, the single retained tile and four discarded ones; right, five random members, <b class="t-keep">kept</b> or <b class="t-drop">discarded</b>.</p>
        </div>
      </div>
    </div>

    <!-- Step 4: select -->
    <div class="gs-select gs-reveal">
      <div class="gs-step-num">4</div>
      <div class="gs-select-body">
        <h3>Select the most diverse observations of each cluster</h3>
        <p>Both diversities are combined into a single score, each term scaled by its interquartile range over the archive.
        Each cluster then keeps its \(B_c\) observations with the highest \(S_i\).</p>
        <div class="gs-eq">\[ S_i = \frac{\log G_i}{\operatorname{IQR}(\log G)} + \frac{L_i}{\operatorname{IQR}(L)} \]</div>
      </div>
      <div class="gs-select-sum">
        <div><span class="gs-pill">redundancy \(m_i\)</span> decides <b>how many</b> tiles each cluster keeps</div>
        <div><span class="gs-pill gs-pill-ours">score \(S_i\)</span> decides <b>which</b> tiles represent it</div>
        <div><span class="gs-pill gs-pill-muted">no training</span> no labels, no reference data, one pass over frozen features</div>
      </div>
    </div>
  </section>

  <!-- ============================== PROTOCOL ============================== -->
  <section class="gs-section gs-alt" id="protocol">
    <div class="gs-kicker gs-reveal">Evaluation protocol</div>
    <h2 class="gs-reveal">Judge a subset by the model it trains.</h2>
    <p class="gs-lead gs-reveal gs-narrow">Curation is evaluated independently of the representation used for selection: every method picks a
    subset of the <em>same</em> archive, a new model is pretrained <em>from scratch</em> on it with the same recipe and step budget,
    and its frozen features are probed on downstream tasks.</p>
    <div class="gs-flow gs-reveal" id="gs-flow">
      <div class="gs-flow-node">
        <div class="gs-flow-ico"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c-6 5-6 29 0 34M24 7c6 5 6 29 0 34M10 15h28M10 33h28"/></svg></div>
        <h4>Archive</h4>
        <p>Major-TOM Core-S2L2A: 2,238,687 single-date Sentinel-2 tiles of 10&times;10&nbsp;km, every landmass and coastline.</p>
      </div>
      <div class="gs-flow-link" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="gs-flow-node gs-flow-ours">
        <div class="gs-flow-ico"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10h32l-12 15v11l-8 4V25z"/></svg></div>
        <h4>Curation</h4>
        <p>Each method keeps the same budget (1% unless stated). Only tile identifiers move on: no curation feature reaches pretraining.</p>
      </div>
      <div class="gs-flow-link" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="gs-flow-node">
        <div class="gs-flow-ico"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="9" width="30" height="30" rx="4"/><path d="M15 15h6v6h-6zM27 15h6v6h-6zM15 27h6v6h-6zM27 27h6v6h-6z"/></svg></div>
        <h4>Pretraining from scratch</h4>
        <p>ViT-B with MAE (also DINOv2 and LeJEPA): 180k steps &times; 256 crops for <em>every</em> subset. Small subsets are simply revisited more often.</p>
      </div>
      <div class="gs-flow-link" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="gs-flow-node">
        <div class="gs-flow-ico"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18M19 8l5 5 5-5M19 40l5-5 5 5"/></svg></div>
        <h4>Frozen linear probing</h4>
        <p>GEO-Bench, 5 classification and 5 segmentation tasks, best probe selected on validation.</p>
      </div>
    </div>
    <div class="gs-tasks gs-reveal">
      <div><span class="gs-tasks-h">Classification</span><span>So2Sat</span><span>BigEarthNet</span><span>ForestNet</span><span>EuroSAT</span><span>PV4GER</span></div>
      <div><span class="gs-tasks-h">Segmentation</span><span>Cashew</span><span>Chesapeake</span><span>SA Crop</span><span>NeonTree</span><span>PV4GER</span></div>
    </div>
  </section>

  <!-- ============================== RESULTS ============================== -->
  <section class="gs-section" id="results">
    <div class="gs-kicker gs-reveal">Results</div>
    <h2 class="gs-reveal">Better than the full archive, and than every heuristic.</h2>
    <p class="gs-lead gs-reveal gs-narrow">Uniformly sampling 1% of the archive loses 0.9 points in classification and 2.2 mIoU in segmentation.
    Targeted curation closes or reverses this gap, and GeoSelect gives the best mean on both task families.</p>

    <div class="gs-card gs-reveal" id="gs-table-card">
      <div class="gs-card-head">
        <div>
          <h3>GEO-Bench, task by task</h3>
          <p class="gs-card-sub">First row: full-archive pretraining. Other rows: difference with it. Shaded columns: means over the five tasks of each family. Bold: best of each column at 1%.</p>
        </div>
      </div>
      <div class="gs-table-wrap"><table class="gs-table" id="gs-table"></table></div>
      <p class="gs-note">Classification: accuracy (BigEarthNet: &micro;F1); segmentation: mIoU. SemDeDup is budget-controlled. The official subset (Core-S2L2A-249k, 11%) does not match the budget and is shown for reference.</p>
    </div>

    <div class="gs-grid2">
      <div class="gs-card gs-reveal" id="gs-ssl">
        <div class="gs-card-head gs-card-head-col">
          <h3>Across SSL objectives</h3>
          <p class="gs-card-sub">Gain over full-archive pretraining when a ViT-B is pretrained with DINOv2 or LeJEPA on the same 1% subsets as MAE.</p>
        </div>
        <div class="gs-mini-legend"><span><i class="c-sem"></i>UniverSat SemDeDup</span><span><i class="c-ours"></i>GeoSelect</span></div>
        <div class="gs-ssl"></div>
        <p class="gs-note">View-based objectives gain even more than MAE: +3.4 points in classification with both (MAE: +2.4), consistent with crops of locally diverse tiles containing varied content.</p>
      </div>
      <div class="gs-card gs-reveal" id="gs-xmod">
        <div class="gs-card-head gs-card-head-col">
          <h3>Applied to radar</h3>
          <p class="gs-card-sub">MAE on Sentinel-1: full archive vs. 1% subsets selected by GeoSelect from Sentinel-1 embeddings or from co-registered Sentinel-2 embeddings.</p>
        </div>
        <div class="gs-xmod-ill" aria-hidden="true">
          <span class="gs-xmod-chip s2">GeoSelect on S1 or S2</span>
          <span class="gs-xmod-arrow"><i></i></span>
          <span class="gs-xmod-chip s1">1% Sentinel-1 pretraining</span>
        </div>
        <div class="gs-xmod"></div>
        <p class="gs-note">Both 1% subsets beat the full Sentinel-1 archive on reBEN-S1 with 100&times; less data. Optical embeddings remain useful for radar curation, while the target modality's own embeddings give the larger gain at this budget.</p>
      </div>
    </div>

    <div class="gs-card gs-reveal" id="gs-abl">
      <div class="gs-card-head">
        <div>
          <h3>Local diversity explains most of the gain over SemDeDup</h3>
          <p class="gs-card-sub">Gain over the full archive, MAE, 1% budget. Same clusters and cluster budgets for the last two rows.</p>
        </div>
        <div class="gs-legend"><span><i class="c-cls"></i>Classification</span><span><i class="c-seg"></i>Segmentation</span></div>
      </div>
      <div class="gs-abl"></div>
      <div class="gs-meters">
        <div class="gs-meter-block">
          <div class="gs-meter-t">Share of the selection in the less locally diverse half of the archive</div>
          <div class="gs-meter" data-v="24"><span class="lbl">SemDeDup</span><span class="bar"><i></i></span><span class="val">24%</span></div>
          <div class="gs-meter ours" data-v="5"><span class="lbl">GeoSelect</span><span class="bar"><i></i></span><span class="val">5%</span></div>
        </div>
        <div class="gs-meter-block">
          <div class="gs-meter-t">Geographic regions covered, relative to SemDeDup</div>
          <div class="gs-meter" data-v="55"><span class="lbl">Top \(L_i\) overall</span><span class="bar"><i></i></span><span class="val">55%</span></div>
          <div class="gs-meter ours" data-v="93"><span class="lbl">GeoSelect</span><span class="bar"><i></i></span><span class="val">93%</span></div>
        </div>
        <div class="gs-meter-block">
          <div class="gs-meter-t">Distance to the nearest kept tile of the same cluster, relative to SemDeDup</div>
          <div class="gs-meter" data-v="41"><span class="lbl">Local ranking</span><span class="bar"><i></i></span><span class="val">41%</span></div>
          <div class="gs-meter ours" data-v="61"><span class="lbl">GeoSelect</span><span class="bar"><i></i></span><span class="val">61%</span></div>
        </div>
      </div>
      <p class="gs-note">Ranking by \(L_i\) within the same cluster budgets is on par with GeoSelect here, but keeps near-duplicates when both are locally diverse: at nearly identical local diversity and coverage, the global term \(G_i\) pushes the nearest kept neighbour 50% farther. Explicitly penalising redundancy matters most for multi-temporal archives.</p>
    </div>
  </section>

  <!-- ============================== SELECTION ============================== -->
  <section class="gs-section gs-alt" id="selection">
    <div class="gs-kicker gs-reveal">What gets kept</div>
    <h2 class="gs-reveal">Coastlines, rivers and relief. Not open ocean.</h2>

    <div class="gs-card gs-card-wide gs-reveal" id="gs-map">
      <div class="gs-card-head">
        <div>
          <h3>Where the 1% comes from</h3>
          <p class="gs-card-sub">Every tile retained at a 1% budget, over the Major-TOM footprint.</p>
        </div>
        <div class="gs-seg" role="tablist" aria-label="Curation strategy">
          <button role="tab" aria-selected="true" data-k="random">Random</button>
          <button role="tab" aria-selected="false" data-k="urban">Urban, top-%</button>
          <button role="tab" aria-selected="false" data-k="geoselect">GeoSelect</button>
        </div>
      </div>
      <div class="gs-map" role="img" aria-label="World map of retained tiles">
        <div class="gs-map-land"></div>
        <div class="gs-map-kept" data-k="random"></div>
        <div class="gs-map-kept" data-k="urban"></div>
        <div class="gs-map-kept" data-k="geoselect"></div>
        <div class="gs-map-scan" aria-hidden="true"></div>
        <div class="gs-map-legend"><span><i class="m-land"></i>archive</span><span><i class="m-kept"></i>kept tile</span></div>
      </div>
      <div class="gs-map-text" aria-live="polite">
        <p data-k="random">Random sampling thins every region uniformly: open ocean, ice sheets and rainforest keep their full share of the budget.</p>
        <p data-k="urban">Prioritising built-up fraction concentrates the budget on dense urban areas in Europe, East and South Asia and North America.</p>
        <p data-k="geoselect">GeoSelect stays broadly distributed over land and favours coastlines and river networks. It discards open-ocean tiles and strongly downsamples ice caps (to 13% of their archive share) and tropical rainforest (to 33%), whose tiles have low local diversity.</p>
      </div>
    </div>

    <div class="gs-grid2 gs-grid2-uneven">
      <div class="gs-card gs-reveal" id="gs-assoc">
        <div class="gs-card-head gs-card-head-col">
          <h3>Not a metadata heuristic in disguise</h3>
          <p class="gs-card-sub">Association between each method's keep/discard decision and metadata attributes (Cram&eacute;r's&nbsp;V; point-biserial for built-up). Outlined: the attribute a handcrafted strategy targets.</p>
        </div>
        <div class="gs-assoc"></div>
      </div>
      <div class="gs-assoc-text gs-reveal">
        <h3>Gains come from distinctions <em>within</em> metadata classes.</h3>
        <p>Handcrafted strategies are strongly tied to the attribute they target. All feature-based methods are only weakly
        associated with any attribute (at most 0.10), and they look alike on this table despite very different downstream
        results.</p>
        <p>GeoSelect's gains are not geographic matching either: on the European BigEarthNet it gains +2.6 points, while a
        Europe-only subset gives &minus;0.1. Its gains span Europe, Asia, Africa and North America.</p>
        <p>It leaves most climate, soil and land-cover distributions close to the archive's, except particularly homogeneous
        classes. Inside those, it keeps the most structured tiles rather than removing the class:</p>
      </div>
    </div>

    <div class="gs-card gs-reveal" id="gs-clim">
      <div class="gs-card-head">
        <div>
          <h3>Inside homogeneous climates</h3>
          <p class="gs-card-sub">K&ouml;ppen&ndash;Geiger classes dominated by uniform tiles: GeoSelect keeps glaciers and nunataks, rivers and coasts, irrigated fields and reefs.</p>
        </div>
      </div>
      <div class="gs-clim"></div>
    </div>


    <div class="gs-grid2">
      <div class="gs-card gs-reveal" id="gs-flip">
        <div class="gs-card-head gs-card-head-col">
          <h3>Same budget, different picks</h3>
          <p class="gs-card-sub">Tiles retained by only one method at 1%. SemDeDup can keep internally uniform tiles; GeoSelect keeps tiles mixing several types of content. They share less than a third of their selection.</p>
        </div>
        <button class="gs-ghost gs-flip-btn" data-act="flip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h13l-3-3M20 17H7l3 3"/></svg><span>Show patch tokens</span></button>
        <div class="gs-flip-rows"></div>
      </div>
      <div class="gs-card gs-reveal" id="gs-dups">
        <div class="gs-card-head gs-card-head-col">
          <h3>Near-duplicates are not automatically neighbours</h3>
          <p class="gs-card-sub">Each pair comes from the same cluster, and ranking by \(L_i\) alone keeps both tiles. Only global diversity leads GeoSelect to keep a single one.</p>
        </div>
        <div class="gs-wipe gs-wipe-dup">
          <img class="gs-wipe-a" alt="Tile discarded by GeoSelect" width="360" height="360">
          <img class="gs-wipe-b" alt="Its near-duplicate kept by GeoSelect" width="360" height="360">
          <div class="gs-wipe-handle"><span></span></div>
          <span class="gs-wipe-lbl l t-drop-bg">discarded</span><span class="gs-wipe-lbl r t-keep-bg">kept</span>
        </div>
        <div class="gs-dup-info" aria-live="polite"></div>
        <div class="gs-dup-pick"></div>
        <p class="gs-note">Over all such pairs: median distance 1,500&nbsp;km, fewer than 10% within 50&nbsp;km. This redundancy is semantic, not spatial: spatial thinning would not remove it.</p>
      </div>
    </div>

    <div class="gs-card gs-reveal" id="gs-rand">
      <div class="gs-card-head">
        <div>
          <h3>A random draw from the 1% subset</h3>
          <p class="gs-card-sub">24 tiles drawn uniformly at random, shown as drawn. Most combine several types of content; every semantic cluster keeps at least one tile.</p>
        </div>
      </div>
      <div class="gs-rand"></div>
    </div>
  </section>

  <!-- ============================== S2-NAIP ============================== -->
  <!-- Supplementary section "Curating a second archive: S2-NAIP" (tables s2naip.tex and s2naip_knn.tex). -->
  <section class="gs-section" id="s2naip">
    <div class="gs-kicker gs-reveal">A second archive &middot; S2-NAIP</div>
    <h2 class="gs-reveal">A different archive: one country, many dates.</h2>
    <p class="gs-lead gs-reveal gs-narrow">Major-TOM is global, with one image per place. AI2-S2-NAIP is the opposite: small
    640&nbsp;m tiles of the contiguous United States, each observed 16 to 32 times within a few months. After cleaning, it holds
    302M Sentinel-2 images, 135&times; more than Major-TOM. Far narrower geographically, it mainly tests whether GeoSelect can filter
    an archive of hundreds of millions of images, with the same recipe.</p>

    <div class="gs-stats">
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-to="302" data-dec="0">302</span><small>M</small></div><div class="gs-stat-lbl">observations after cleaning<br><span>135&times; Major-TOM</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-from="302" data-to="3.0" data-dec="1">3.0</span><small>M</small></div><div class="gs-stat-lbl">kept at a 1% budget<br><span>more than all of Major-TOM</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-from="1" data-to="100" data-dec="0">100</span><small>&times;</small></div><div class="gs-stat-lbl">fewer images, same linear probe<br><span>&minus;0.1 cls. &middot; +0.2 mIoU</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><small>+</small><span class="gs-count" data-to="1.4" data-dec="1">1.4</span></div><div class="gs-stat-lbl">points with k-NN<br><span>vs. the full archive</span></div></div>
    </div>

    <div class="gs-card gs-reveal" id="gs-naip-scale">
      <div class="gs-card-head">
        <div>
          <h3>From half a billion images to a 1% subset</h3>
          <p class="gs-card-sub">Each square is one million Sentinel-2 observations.</p>
        </div>
        <button class="gs-ghost" data-act="replay"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg><span>Replay</span></button>
      </div>
      <div class="gs-naip-scale">
        <div class="gs-naip-waffle"><canvas role="img" aria-label="Waffle chart: 513 million images in the release, 302 million after cleaning, 3 million kept by GeoSelect"></canvas></div>
        <div class="gs-naip-side">
          <div class="gs-naip-count" aria-live="polite"><b>0</b><span>Sentinel-2 images in the release</span></div>
          <ol class="gs-naip-steps">
            <li data-s="0"><button type="button"><em>1</em><b>Release</b><span>19.3M tiles &times; 16&ndash;32 dates = 513M images</span></button></li>
            <li data-s="1"><button type="button"><em>2</em><b>Clean</b><span><i class="k-rep"></i>130M repeated passes &middot; <i class="k-cld"></i>82M cloudy or incomplete</span></button></li>
            <li data-s="2"><button type="button"><em>3</em><b>Curate with GeoSelect</b><span><i class="k-keep"></i>1% kept: 3.0M observations</span></button></li>
          </ol>
          <div class="gs-naip-vs">
            <div class="gs-naip-vs-row ours"><span class="lbl">1% of S2-NAIP</span><span class="bar"><i data-w="100"></i></span><span class="val">3.02M</span></div>
            <div class="gs-naip-vs-row"><span class="lbl">All of Major-TOM</span><span class="bar"><i data-w="74"></i></span><span class="val">2.24M</span></div>
          </div>
        </div>
      </div>
      <p class="gs-note">Cleaning keeps one observation per satellite pass (a quarter of the images repeat a pass, most often the same
      acquisition processed twice), removes the offset that ESA processing baseline 04.00 adds to digital numbers, and keeps observations
      with no missing pixel and at most 5% cloud cover. For curation, each observation is embedded by UniverSat at 20&nbsp;m
      (4&times;4 patch tokens of 160&nbsp;m), with 96,367 semantic clusters. Curation stays cheap at this scale: about 30 H100
      GPU-hours to embed all 302M observations, and about six A100 GPU-hours for clustering and selection.</p>
    </div>

    <div class="gs-card gs-reveal" id="gs-naip-res">
      <div class="gs-card-head">
        <div>
          <h3>Full-archive performance from a hundred times fewer images</h3>
          <p class="gs-card-sub">MAE pretrained on the full S2-NAIP archive or on 1% subsets of it (3.0M images), evaluated frozen on
          GEO-Bench. Difference with pretraining on the full archive.</p>
        </div>
      </div>
      <div class="gs-race-legend">
        <span><i class="c-unif"></i>Random</span>
        <span><i class="c-urban"></i>Urban, top-%</span>
        <span><i class="c-sem"></i>UniverSat SemDeDup</span>
        <span><i class="c-ours"></i>GeoSelect</span>
        <span><i class="gs-nr-key"></i>within &plusmn;0.5 of the full archive</span>
      </div>
      <div class="gs-naip-res"></div>
      <div class="gs-map-text">
        <p class="on">With 1% of the archive, even a random subset stays close to full-archive pretraining: S2-NAIP is redundant in space
        and time, with small tiles and many dates per place, and has few large homogeneous regions, unlike Major-TOM, which leaves little room
        for gains on single-date tasks. Still, GeoSelect is the only subset that preserves segmentation (+0.2 mIoU), stays comparable in
        classification (&minus;0.1), and <b>performs best with k-NN, +1.4 points</b>.</p>
      </div>
      <p class="gs-note">k-NN classifies mean- or max-pooled patch tokens, chosen with \(k\) and the distance on each dataset's validation
      set. Linear probing: means over the 5 classification and 5 segmentation tasks of Table&nbsp;1. Inputs are restricted to the ten bands
      used for curation. Random draws images uniformly. Every run takes the same 180k steps: 2.4 passes over the full archive, about 240
      over a 1% subset.</p>
    </div>

    <div class="gs-card gs-reveal" id="gs-naip-dates">
      <div class="gs-card-head gs-card-head-col">
        <h3>Two dates per place, not one</h3>
        <p class="gs-card-sub">Observations retained per selected tile, at a 1% budget. The archive has 16 to 32 dates per tile.</p>
      </div>
      <div class="gs-naip-dates-wrap">
        <div class="gs-naip-dates"></div>
        <p class="gs-lead">A random subset of the same size keeps about one observation per tile. Both curated selections keep about two:
        different dates of the same place are often distinct enough to be retained together, so neither selection reduces the archive to
        one image per location. Curation thus exploits the temporal diversity of this archive, which Major-TOM, with one image per place,
        does not offer.</p>
      </div>
    </div>
  </section>

  <!-- ============================== EFFICIENCY ============================== -->
  <section class="gs-section gs-alt" id="efficiency">
    <div class="gs-kicker gs-reveal">Cost and release</div>
    <h2 class="gs-reveal">Curate once. Reuse for every pretraining run.</h2>
    <div class="gs-stats gs-stats-3">
      <div class="gs-stat gs-reveal"><div class="gs-stat-num">&asymp;<span class="gs-count" data-to="65" data-dec="0">65</span></div><div class="gs-stat-lbl">A100 GPU-hours<br><span>to extract patch-token statistics, once</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num">&lt;<span class="gs-count" data-to="1" data-dec="0">1</span><small>min</small></div><div class="gs-stat-lbl">for clustering and selection<br><span>on one GPU</span></div></div>
      <div class="gs-stat gs-reveal"><div class="gs-stat-num"><span class="gs-count" data-from="21" data-to="0.2" data-dec="1">0.2</span><small>TB</small></div><div class="gs-stat-lbl">to store and transfer<br><span>instead of 21 TB, at matched compute</span></div></div>
    </div>
    <p class="gs-lead gs-reveal gs-narrow">The main cost is a single forward pass of UniverSat over the archive, far less than pretraining a foundation
    model. Releasing patch-token statistics alongside global embeddings would let anyone curate an EO archive without
    running the encoder again. We will release the curation pipeline and the curated subsets.</p>
  </section>

  <!-- ============================== CITATION ============================== -->
  <section class="gs-section" id="citation">
    <div class="gs-kicker gs-reveal">Citation</div>
    <h2 class="gs-reveal">Cite this work</h2>
    <div class="gs-bib gs-reveal">
      <button class="gs-ghost gs-bib-copy" data-act="copy"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg><span>Copy</span></button>
      <!-- TODO: arXiv identifier -->
<pre id="gs-bibtex">@article{astruc2026geoselect,
  title   = {Less Is More: Semantic Curation of Earth Observation Data
             for Self-Supervised Learning},
  author  = {Astruc, Guillaume and Gonthier, Nicolas and Mallet, Clement
             and Landrieu, Loic},
  journal = {arXiv preprint},
  year    = {2026}
}</pre>
    </div>
  </section>

  <footer class="gs-footer">GeoSelect &middot; Less Is More &middot; 2026</footer>
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>
<script src="/assets/publications/geoselect/geoselect.js?v=20261123g"></script>
