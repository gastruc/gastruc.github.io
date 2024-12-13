---
layout: project
permalink: /anysat
title: "AnySat: An Earth Observation Model for Any Resolutions, Scales, and Modalities"
short_name: AnySat
author: Guillaume Astruc
description: This work introduces OmniSat, a novel architecture that exploits the spatial alignment between multiple EO modalities to learn expressive multimodal representations without labels.
keywords: remote sensing, self-supervised learning, multimodal learning, earth observation, satellite imagery, foundation model
analytics: https://www.googletagmanager.com/gtag/js?id=G-FLNC8B6RH9

paper_title: "AnySat: An Earth Observation Model for Any Resolutions, Scales, and Modalities"
paper_authors: <a href="/">Guillaume Astruc</a>, <a href="https://ngonthier.github.io/">Nicolas Gonthier</a>, <a href="https://www.umr-lastig.fr/clement-mallet/">Clement Mallet</a>, <a href="https://loiclandrieu.com/">Loic Landrieu</a>
journal: Arxiv 2025
buttons:
  - type: github
    text: Code
    url: https://github.com/gastruc/AnySat
  - type: arxiv
    text: Paper
    url: https://arxiv.org/abs/2404.08351
  - type: hugging_face
    text: "Models"
    url: https://huggingface.co/g-astruc/AnySat
  # - type: pdf
  #   text: Poster
  #   url: /assets/publications/omnisat/omni.pdf
  # - type: video
  #   text: Video
  #   url: https://www.youtube.com/watch?v=1JUoog7CWDs

# abstract: Geospatial models must adapt to the diversity of Earth observation data in terms of resolutions, scales, and modalities. However, existing approaches expect fixed input configurations, which limits their practical applicability. We propose AnySat, a multimodal model based on joint embedding predictive architecture (JEPA) and resolution-adaptive spatial encoders, allowing us to train a single model on highly heterogeneous data in a <b>self-supervised manner</b>. To demonstrate the advantages of this unified approach, we compile GeoPlex, a collection of 5 multimodal datasets with varying characteristics and 11 distinct sensors. We then train a single powerful model on these diverse datasets <b>simultaneously</b>.
# Once fine-tuned, we achieve better or near <b>state-of-the-art results</b> on the datasets of GeoPlex and 3 additional ones for 4 environment monitoring tasks: land cover mapping, crop type classification, change detection, and forest analysis.

# poster:
#     url: /assets/publications/omnisat/omni.pdf
# video:
#     url: https://www.youtube.com/embed/1JUoog7CWDs?si=dwYRpDAvFl5tkSGj
bibtex: ""
# acknowledgements: This work was supported by ANR project READY3D ANR-19-CE23-0007,
#   and was granted access to the HPC resources of IDRIS under the allocation AD011014719 made
#   by GENCI. We thank Anatol Garioud and Sebastien Giordano for their help on the creation of ´
#   TreeSatAI-TS and PASTIS-HD datasets. The SPOT images are opendata thanks to the Dataterra
#   Dinamis initiative in the case of the "<a href="https://dinamis.data-terra.org/opendata/">Couverture France DINAMIS</a>" program. We thank Jordi Inglada for inspiring discussions and valuable feedback.
---

<div class="content-wrapper">
    <section id="model-overview" class="feature-section">
        <div class="section-icon">🛰️</div>
        <h2>Introducing AnySat</h2>
        <div class="feature-content">
            <p class="highlight-text">
                AnySat is a multimodal model based on joint embedding predictive architecture (JEPA) and resolution-adaptive spatial encoders, allowing us in a <b>self-supervised manner</b> to handle:
            </p>
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>Multiple Scales</h3>
                    <p>From local to global observations</p>
                </div>
                <div class="feature-item">
                    <h3>Various Resolutions</h3>
                    <p>Spatial, spectral, and temporal</p>
                </div>
                <div class="feature-item">
                    <h3>Different Modalities</h3>
                    <p>Multiple sensor combinations</p>
                </div>
            </div>
        </div>
    </section>

    <section id="training-approach" class="feature-section">
        <div class="section-icon">🌍</div>
        <h2>Datasets</h2>
        <div class="feature-content">
            <p class="highlight-text">
                We compile GeoPlex, a collection of multimodal datasets with varying characteristics to a single powerful model on these diverse datasets <b>simultaneously</b>. We argue quality and diversity over quantity.
            </p>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">5</span>
                    <span class="stat-label">Diverse Datasets</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">11</span>
                    <span class="stat-label">Distinct Sensors</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">0.2-250m</span>
                    <span class="stat-label">Resolution Range</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">0.4-16ha</span>
                    <span class="stat-label">Sample Areas</span>
                </div>
            </div>
        </div>
    </section>

    <section id="results" class="feature-section">
        <div class="section-icon">🏆</div>
        <h2>State-of-the-Art Results</h2>
        <div class="feature-content">
            <div class="results-highlights">
                <div class="result-item">
                    <h3>6 Datasets</h3>
                    <p>State-of-the-art performance</p>
                </div>
                <div class="result-item">
                    <h3>4 Tasks</h3>
                    <p>Comprehensive geospatial analysis</p>
                </div>
                <div class="result-item">
                    <h3>Linear Probing</h3>
                    <p>Excellence in semantic segmentation</p>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.feature-section {
    margin-bottom: 3rem;
    padding: 2rem;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
    text-align: center;
}

.stat-item {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    display: block;
}

.stat-label {
    color: #2d3748;
    font-weight: 500;
}

.results-highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.highlight-text {
    font-size: 1.2rem;
    color: #2c3e50;
    text-align: center;
    margin: 1rem 0;
}

@media (max-width: 768px) {
    .feature-grid, .stats-grid, .results-highlights {
        grid-template-columns: 1fr;
    }
}
</style>


