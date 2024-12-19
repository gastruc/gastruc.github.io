---
layout: project
permalink: /anysat
title: "AnySat: An Earth Observation Model<br>for Any Resolutions, Scales, and Modalities"
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
    url: https://arxiv.org/abs/2412.14123
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
bibtex: "@article{astruc2024anysat,\n
    &nbsp;&nbsp; title={{AnySat: An Earth} Observation Model for Any Resolutions, Scales, and Modalities},\n
    &nbsp;&nbsp; author={Astruc, Guillaume and Gonthier, Nicolas and Mallet, Clement and Landrieu, Loic},\n
    &nbsp;&nbsp; journal={arXiv preprint arXiv:2412.14123},\n
    &nbsp;&nbsp; year={2024}\n
}"
acknowledgements: This work was granted access to the HPC resources of IDRIS under the allocations AD011014719 and AD011014286R1 made by GENCI. We thank Jordi Inglada, Antoine Labatie, Dimitris Samaras, Yohann Perron, Vincent Lepetit for inspiring discussions and valuable feedback.
---

<div class="content-wrapper">
    <section id="model-overview" class="feature-section">
        <div class="section-icon"></div>
        <h2>Introducing AnySat</h2>
        <div class="feature-content">
            <p class="highlight-text">
                AnySat is a multimodal model based on joint embedding predictive architecture (JEPA) and resolution-adaptive spatial encoders, allowing us in a <b>self-supervised manner</b> to handle:
            </p>
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>📏 Multiple Scales</h3>
                    <p>From local to global observations</p>
                </div>
                <div class="feature-item">
                    <h3>🔍 Various Resolutions</h3>
                    <p>Spatial, spectral, and temporal</p>
                </div>
                <div class="feature-item">
                    <h3>🛰️ Different Modalities</h3>
                    <p>Multiple sensor combinations</p>
                </div>
            </div>
        </div>
    </section>

    <section id="key-innovations" class="feature-section">
        <div class="section-icon">💡</div>
        <h2>Key Innovations</h2>
        <div class="innovations-grid">
            <div class="innovation-card">
                <div class="innovation-icon">🔄</div>
                <h3>Shared Architecture</h3>
                <p>75% of parameters shared across all modalities and scales, enabling efficient multi-modal learning</p>
            </div>
            <div class="innovation-card">
                <div class="innovation-icon">🎯</div>
                <h3>Scale-Adaptive Design</h3>
                <p>Modified JEPA learning scheme with scale-adaptive spatial encoders for multi-resolution processing</p>
            </div>
            <div class="innovation-card">
                <div class="innovation-icon">🌐</div>
                <h3>Universal Compatibility</h3>
                <p>Handles data from 0.2m to 500m resolution, 3-12 channels, and areas from 0.3 to 2600 hectares</p>
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
                    <span class="stat-number">0.4-160ha</span>
                    <span class="stat-label">Sample Areas</span>
                </div>
            </div>
            <div class="architecture-image" style="max-width: 800px; margin: 2rem auto; text-align: center;">
                <img src="assets/publications/anysat/datasets.png" alt="AnySat Datasets" class="responsive-image">
            </div>
        </div>
    </section>

    <section id="architecture" class="feature-section">
        <div class="section-icon">🏗️</div>
        <h2>Architecture</h2>
        <div class="architecture-content">
            <div class="architecture-image">
                <img src="assets/publications/anysat/arch.png" alt="AnySat Architecture" class="responsive-image">
            </div>
            <div class="architecture-text">
                <h3>Scale-Adaptive JEPA Design</h3>
                <p>AnySat employs a novel Joint Embedding Predictive Architecture (JEPA) that adapts to multiple spatial scales and resolutions. Key components include:</p>
                <ul class="feature-list">
                    <li>Resolution-adaptive spatial encoders</li>
                    <li>Multi-modal fusion mechanism</li>
                    <li>Scale-aware prediction heads</li>
                    <li>Self-supervised learning framework</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="results" class="feature-section">
        <div class="section-icon">📊</div>
        <h2>Results</h2>
            <div class="architecture-image" style="max-width: 1100px; margin: 2rem auto; text-align: center;">
                <img src="assets/publications/anysat/result.png" alt="AnySat Results" class="responsive-image">
            </div>
    </section>

    <section id="installation" class="feature-section">
        <div class="section-icon">⚡</div>
        <h2>Quick Start</h2>
        <pre><code class="language-python" style="color: #ffffff;">
import torch
import anysat

# Load the model
anysat_B = torch.hub.load('gastruc/anysat', 'anysat_B')

# Prepare your data
data = {
    'naip':# NAIP single image B, 3, 24*H, 24*W
    's2':# Sentinel-2 time series B, T1, 10, 3*H, 3*W
    'alos2':# ALOS-2 time series B, T2, 3, H, W
}

# Extract features
features = AnySat(data, patch_size=20)     # patch_size in meters
        </code></pre>
    </section>
</div>

<style>
/* Base styles */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --background-light: #f8f9fa;
    --text-color: #2c3e50;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Hero Section */
.hero-section {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, var(--background-light) 0%, #ffffff 100%);
    border-radius: 12px;
    margin-bottom: 3rem;
}

.hero-content h1 {
    font-size: 3.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 2rem;
}

.tech-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Feature Cards */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
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

.architecture-content {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
}

.architecture-image {
    flex: 1;
    min-width: 300px;
}

.architecture-text {
    flex: 1;
    min-width: 300px;
}

.responsive-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.datasets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.dataset-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.performance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.metric-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-color);
    margin-top: 1rem;
}

.code-block-wrapper {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 1.5rem;
}

.code-block-wrapper pre {
    background: #2d2d2d;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1rem 0;
}

.code-block-wrapper code {
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
}

.feature-list {
    list-style-type: none;
    padding: 0;
}

.feature-list li {
    padding: 0.5rem 0;
    position: relative;
    padding-left: 1.5rem;
}

.feature-list li:before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent-color);
}

@media (max-width: 768px) {
    .architecture-content {
        flex-direction: column;
    }
    
    .architecture-image, .architecture-text {
        width: 100%;
    }
}

.innovations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.innovation-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.innovation-card:hover {
    transform: translateY(-5px);
}

.innovation-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.task-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-details {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.dataset {
    color: var(--text-color);
    font-weight: 500;
}

.performance {
    color: var(--accent-color);
    font-weight: bold;
}

.usage-example {
    margin-top: 2rem;
}

.installation-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 1.5rem;
}

.install-command {
    margin-bottom: 2rem;
}

.code-snippet {
    display: flex;
    align-items: center;
    background: #2d2d2d;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
}

.code-snippet code {
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    flex-grow: 1;
}

.copy-button {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    padding: 0.5rem;
    transition: opacity 0.3s;
}

.copy-button:hover {
    opacity: 0.7;
}

.copy-icon {
    font-size: 1.2rem;
}

.code-block-wrapper {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.code-block-wrapper pre {
    background: #2d2d2d;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
}

.code-block-wrapper code {
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
}

h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

/* Add dark mode styles for code blocks */
@media (prefers-color-scheme: dark) {
    .feature-section pre {
        background: #1a1a1a;
        color: #ffffff;
        border: 1px solid #333;
    }
    
    .feature-section code {
        color: #ffffff;
    }
    
    /* Add syntax highlighting colors for dark mode */
    .feature-section .language-python .comment { color: #6a9955; }
    .feature-section .language-python .keyword { color: #569cd6; }
    .feature-section .language-python .string { color: #ce9178; }
    .feature-section .language-python .function { color: #dcdcaa; }
}

/* Ensure code block is always visible */
.feature-section pre {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid #e9ecef;
}

.feature-section code {
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
}

/* Improve text visibility in boxes */
.feature-item p,
.innovation-card p,
.architecture-text p,
.feature-list li {
    color: #333333;
}

@media (prefers-color-scheme: dark) {
    .feature-item,
    .innovation-card,
    .architecture-text,
    .feature-section {
        background: #2d2d2d;
    }

    .feature-item p,
    .innovation-card p,
    .architecture-text p,
    .feature-list li,
    .feature-item h3,
    .innovation-card h3,
    .architecture-text h3 {
        color: #ffffff;
    }

    .stat-item {
        background: #2d2d2d;
    }

    .stat-number,
    .stat-label {
        color: #ffffff;
    }

    .highlight-text {
        color: #ffffff;
    }
}

/* Base heading styles */
.feature-section h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

@media (prefers-color-scheme: dark) {
    /* ... existing dark mode styles ... */

    .feature-section h2,
    .section-icon {
        color: #ffffff;
    }
}

/* Improve code block readability */
.feature-section pre {
    background: #282c34;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid #3e4451;
}

.feature-section code {
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.6;
    font-size: 0.95rem;
}

/* Syntax highlighting for Python */
.language-python .comment { color: #98c379 !important; }  /* Brighter green for comments */
.language-python .keyword { color: #c678dd !important; }  /* Purple for keywords */
.language-python .string { color: #e5c07b !important; }   /* Yellow for strings */
.language-python .function { color: #61afef !important; } /* Blue for functions */
.language-python .class { color: #e06c75 !important; }    /* Red for classes */

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    .feature-section pre {
        background: #282c34;
        border-color: #3e4451;
    }
    
    .feature-section code {
        color: #abb2bf;  /* Light
}

/* Code block base styles */
.feature-section pre {
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    font-size: 0.95rem;
    line-height: 1.6;
}

.feature-section code {
    font-family: 'Courier New', Courier, monospace;
}

/* Light mode */
@media (prefers-color-scheme: light) {
    .feature-section pre {
        background: #ffffff;
        border: 1px solid #e1e4e8;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .feature-section code {
        color: #000000;
    }
    
    /* Syntax highlighting for light mode */
    .language-python .comment { color: #686868 !important; }
    .language-python .keyword { color: #d32f2f !important; }
    .language-python .string { color: #008000 !important; }
    .language-python .function { color: #0033cc !important; }
    .language-python .class { color: #116329 !important; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .feature-section pre {
        background: #282c34;
        border: 1px solid #3e4451;
    }
    
    .feature-section code {
        color: #abb2bf;
    }
    
    /* Syntax highlighting for dark mode */
    .language-python .comment { color: #98c379 !important; }
    .language-python .keyword { color: #c678dd !important; }
    .language-python .string { color: #e5c07b !important; }
    .language-python .function { color: #61afef !important; }
    .language-python .class { color: #e06c75 !important; }
}
</style>

<script>
function copyToClipboard(button) {
    const code = "pip install anysat";
    navigator.clipboard.writeText(code);
    
    const originalIcon = button.innerHTML;
    button.innerHTML = '<span class="copy-icon">✓</span>';
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
    }, 2000);
}
</script>


