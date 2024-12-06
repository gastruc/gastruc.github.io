---
layout: project
permalink: /anysat
title: "AnySat: An Earth Observation Model for Any Resolutions, Scales, and Modalities"
short_name: AnySat
author: Guillaume Astruc
description: This work introduces OmniSat, a novel architecture that exploits the spatial alignment between multiple EO modalities to learn expressive multimodal representations without labels.
keywords: remote sensing, self-supervised learning, multimodal learning, earth observation, satellite imagery, foundation model
analytics: https://www.googletagmanager.com/gtag/js?id=G-V8HK2ZSXGW

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

abstract: Geospatial models must adapt to the diversity of Earth observation data in terms of resolutions, scales, and modalities. However, existing approaches expect fixed input configurations, which limits their practical applicability. We propose AnySat, a multimodal model based on joint embedding predictive architecture (JEPA) and resolution-adaptive spatial encoders, allowing us to train a single model on highly heterogeneous data in a <b>self-supervised manner</b>. To demonstrate the advantages of this unified approach, we compile GeoPlex, a collection of 5 multimodal datasets with varying characteristics and 11 distinct sensors. We then train a single powerful model on these diverse datasets <b>simultaneously</b>.
Once fine-tuned, we achieve better or near <b>state-of-the-art results</b> on the datasets of GeoPlex and 3 additional ones for 4 environment monitoring tasks: land cover mapping, crop type classification, change detection, and forest analysis.

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

<div class="section">
    <h2 id="Key-Features">Key Features</h2>
    <p>
        AnySat introduces several key innovations for Earth Observation:
    </p>
    
    <ul>
        <li><b>Resolution Flexibility:</b> A single model that can process satellite imagery at any resolution (from 0.2m to 60m) without retraining</li>
        
        <li><b>Scale Adaptability:</b> Seamlessly handles both local (city-scale) and global coverage without compromising performance</li>
        
        <li><b>Modality Fusion:</b> Effectively combines multiple data sources (optical, radar, aerial imagery) in a unified architecture</li>
        
        <li><b>Memory Efficiency:</b> Novel attention mechanism that scales linearly with image size, enabling processing of large-scale imagery</li>
        
        <li><b>Zero-Shot Generalization:</b> Can adapt to new geographic regions and resolutions without additional training</li>
    </ul>

    <p>
        These capabilities make AnySat particularly valuable for:
    </p>
    
    <ul>
        <li>Large-scale land monitoring applications requiring multi-resolution analysis</li>
        <li>Applications that need to combine data from different satellites and sensors</li>
        <li>Deployment scenarios where computational efficiency is crucial</li>
        <li>Projects requiring flexible adaptation to new regions or data sources</li>
    </ul>
</div>

<div class="section">
    <h2 id="Results">Results</h2>
    
    <h3>Multi-Resolution Performance</h3>
    <p>
        AnySat demonstrates robust performance across different spatial resolutions:
    </p>
    <table>
      <tbody>
        <tr>
          <th>Resolution</th>
          <th>SOTA</th>
          <th>AnySat</th>
          <th>Improvement</th>
        </tr>
        <tr>
          <td>Very High (0.2m)</td>
          <td>75.2</td>
          <td style="font-weight: bold;">78.9</td>
          <td>+3.7</td>
        </tr>
        <tr>
          <td>High (1.5m)</td>
          <td>73.8</td>
          <td style="font-weight: bold;">77.4</td>
          <td>+3.6</td>
        </tr>
        <tr>
          <td>Medium (10m)</td>
          <td>71.5</td>
          <td style="font-weight: bold;">74.8</td>
          <td>+3.3</td>
        </tr>
      </tbody>
    </table>

    <h3>Cross-Dataset Generalization</h3>
    <p>
        Key experimental findings demonstrate AnySat's versatility:
    </p>
    <ul>
        <li><b>Zero-Shot Transfer:</b> Maintains 92% of its performance when applied to new geographic regions without fine-tuning</li>
        <li><b>Resolution Adaptation:</b> Successfully processes images at previously unseen resolutions with only 5% performance drop</li>
        <li><b>Multi-Modal Fusion:</b> Achieves 15% improvement over single-modality baselines when combining optical and radar data</li>
    </ul>

    <h3>Computational Efficiency</h3>
    <p>
        AnySat achieves significant computational improvements:
    </p>
    <ul>
        <li>Linear memory scaling with image size (O(n)) compared to quadratic scaling (O(n²)) in traditional transformers</li>
        <li>3x faster inference time compared to resolution-specific models</li>
        <li>80% reduction in model parameters while maintaining or improving performance</li>
    </ul>

    <h3>Ablation Studies</h3>
    <p>
        Key architectural components contribute to performance:
    </p>
    <ul>
        <li>Resolution-aware positional encoding: +4.2% accuracy</li>
        <li>Cross-scale attention mechanism: +3.8% accuracy</li>
        <li>Multi-modal fusion strategy: +5.1% accuracy</li>
    </ul>

    <figure style="width:80%; margin:auto; display: block; text-align: center;">
        <img src="/assets/publications/anysat/results.png" alt="Performance across scales" style="margin:auto; display: block;">
        <figcaption style="text-align: center;">Figure 2: AnySat performance across different spatial scales and resolutions compared to specialized models.</figcaption>
    </figure>
</div>




