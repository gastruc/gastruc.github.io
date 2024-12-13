---
layout: project
permalink: /omnisat
title: "OmniSat: Self-Supervised Modality Fusion for Earth Observation"
short_name: OmniSat
author: Guillaume Astruc
description: This work introduces OmniSat, a novel architecture that exploits the spatial alignment between multiple EO modalities to learn expressive multimodal representations without labels.
keywords: remote sensing, self-supervised learning, multimodal learning, earth observation, satellite imagery
analytics: https://www.googletagmanager.com/gtag/js?id=G-FLNC8B6RH9

paper_title: "OmniSat: Self-Supervised Modality Fusion for Earth Observation"
paper_authors: <a href="/">Guillaume Astruc</a>, <a href="https://ngonthier.github.io/">Nicolas Gonthier</a>, <a href="https://www.umr-lastig.fr/clement-mallet/">Clement Mallet</a>, <a href="https://loiclandrieu.com/">Loic Landrieu</a>
journal: ECCV 2024
buttons:
  - type: github
    text: Code
    url: https://github.com/gastruc/OmniSat
  - type: arxiv
    text: Paper
    url: https://arxiv.org/abs/2404.08351
  - type: pdf
    text: Poster
    url: /assets/publications/omnisat/omni.pdf
  - type: video
    text: Video
    url: https://www.youtube.com/watch?v=1JUoog7CWDs

abstract: The diversity and complementarity of sensors available for Earth Observations (EO) calls for developing bespoke self-supervised multimodal learning 
    approaches. However, current multimodal EO datasets and models typically focus on a single data type, either mono-date images or time series, 
    which limits their impact. To address this issue, we introduce OmniSat, a novel architecture able to merge diverse EO modalities into <b>expressive 
    features without labels by exploiting their alignment</b>. To demonstrate the advantages of our approach, we create two new multimodal datasets 
    by augmenting existing ones with new modalities. As demonstrated for three downstream tasks---forestry, land cover classification, 
    and crop mapping---OmniSat can learn rich representations without supervision, leading to state-of-the-art performances in semi- and fully 
    supervised settings. Furthermore, our multimodal pretraining scheme improves performance <b>even when only one modality is available for inference</b>.

poster:
    url: /assets/publications/omnisat/omni.pdf
video:
    url: https://www.youtube.com/embed/1JUoog7CWDs?si=dwYRpDAvFl5tkSGj
bibtex: "@inproceedings{astruc2025omnisat, \n
    &nbsp;&nbsp; title={Omnisat: Self-supervised modality fusion for earth observation}, \n
    &nbsp;&nbsp; author={Astruc, Guillaume and Gonthier, Nicolas and Mallet, Clement and Landrieu, Loic}, \n
    &nbsp;&nbsp; booktitle={European Conference on Computer Vision}, \n
    &nbsp;&nbsp; pages={409--427}, \n
    &nbsp;&nbsp; year={2025}, \n
    &nbsp;&nbsp; organization={Springer} \n
}"
acknowledgements: This work was supported by ANR project READY3D ANR-19-CE23-0007,
  and was granted access to the HPC resources of IDRIS under the allocation AD011014719 made
  by GENCI. We thank Anatol Garioud and Sebastien Giordano for their help on the creation of ´
  TreeSatAI-TS and PASTIS-HD datasets. The SPOT images are opendata thanks to the Dataterra
  Dinamis initiative in the case of the "<a href="https://dinamis.data-terra.org/opendata/">Couverture France DINAMIS</a>" program. We thank Jordi
  Inglada for inspiring discussions and valuable feedback.
---

<div class="section">
    <h2 id="Datasets">Datasets</h2>
    <p>
        We introduce two augmented datasets with new modalities:
    </p>
    
    <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        
        tr:nth-child(1) {
            color: white;
            background-color: #003e5c;
        }
    </style>
    
    <table>
        <tr>
            <th>Dataset name</th>
            <th>Modalities</th>
            <th>Labels</th>
            <th>Link</th>
        </tr>
        <tr>
            <td>PASTIS-HD</td>
            <td><b>SPOT 6-7 (1m)</b> + S1/S2 (30-140 / year)</td>
            <td>Crop mapping (0.2m)</td>
            <td><a href="https://huggingface.co/datasets/IGNF/PASTIS-HD">huggingface</a> or <a href="https://zenodo.org/records/10908628">zenodo</a></td>
        </tr>
        <tr>
            <td>TreeSatAI-TS</td>
            <td>Aerial (0.2m) + <b>S1/S2 (10-70 / year)</b></td>
            <td>Forestry (60m)</td>
            <td><a href="https://huggingface.co/datasets/IGNF/TreeSatAI-Time-Series">huggingface</a></td>
        </tr>
        <tr>
            <td>FLAIR</td>
            <td>Aerial (0.2m) + S2 (20-114 / year)</td>
            <td>Land cover (0.2m)</td>
            <td><a href="https://huggingface.co/datasets/IGNF/FLAIR">huggingface</a></td>
        </tr>
    </table>

    <p>
        We represent three tiles from the considered multilabel classification datasets:
        FLAIR (a), TreeSatAI-TS (b) and PASTIS-HD (c). TreeSatAI-TS is a new dataset built by replacing
        the single-date Sentinel-1 and 2 images of TreeSatAI by year-long time series. PASTIS-HD (c)
        adds VHR satellite images to PASTIS-R.
    </p>

    <figure style="width:80%; margin:auto; display: block; text-align: center;">
        <img src="/assets/publications/omnisat/datasets.png" alt="Dataset examples" style="margin:auto; display: block;">
        <figcaption style="text-align: center;">Figure 2: Example tiles from our datasets showing different modalities and their corresponding labels.</figcaption>
    </figure>
</div>

<div class="section">
    <h2 id="Results">Results</h2>
    <p>We perform experiments with 100% and 10-20% of labels. When using all modalities, OmniSat outperforms all competing methods. 
      Our pre-training leads to more expressive multimodal features.
      See below, the F1 Score results on 100% of the training data with all modalities available:</p>
    <style>
      table, th, td {
        border: 2px solid black; /* Thicker borders */
        border-collapse: collapse;
        padding: 10px;  /* Increase padding for spacing */
      }
    </style>
    <table>
      <tbody>
        <tr>
          <th>F1 Score All Modalities</th>
          <th>UT&T</th>
          <th>Scale-MAE</th>
          <th>DOFA</th>
          <th>OmniSat (no pretraining)</th>
          <th>OmniSat (with pretraining)</th>
        </tr>
        <tr>
          <td>PASTIS-HD</td>
          <td>53.5</td>
          <td>42.2</td>
          <td>55.7</td>
          <td>59.1</td>
          <td style="font-weight: bold;">69.9</td>
        </tr>
        <tr>
          <td>TreeSatAI-TS</td>
          <td>56.7</td>
          <td>60.4</td>
          <td>71.3</td>
          <td>73.3</td>
          <td style="font-weight: bold;">74.2</td>
        </tr>
        <tr>
          <td>FLAIR</td>
          <td>48.8</td>
          <td>70.0</td>
          <td style="font-weight: bold;">74.9</td>
          <td>70.0</td>
          <td>73.4</td>
        </tr>
      </tbody>
    </table>
    <br>
    <p>OmniSat also improves performance even when only one modality is available for inference. Our self-supervised pre-training scheme 
      improves the features learned by each encoder despite not relying on annotated data.
      F1 Score results on 100% of the training data with only S2 data available:</p>
    
    <table>
      <tbody>
        <tr>
          <th>F1 Score S2 only</th>
          <th>UT&T</th>
          <th>Scale-MAE</th>
          <th>DOFA</th>
          <th>OmniSat (no pretraining)</th>
          <th>OmniSat (with pretraining)</th>
        </tr>
        <tr>
          <td>PASTIS-HD</td>
          <td>61.3</td>
          <td>46.1</td>
          <td>53.4</td>
          <td>60.1</td>
          <td style="font-weight: bold;">70.8</td>
        </tr>
        <tr>
          <td>TreeSatAI-TS</td>
          <td>57.0</td>
          <td>31.5</td>
          <td>39.4</td>
          <td>49.7</td>
          <td style="font-weight: bold;">62.9</td>
        </tr>
        <tr>
          <td>FLAIR</td>
          <td>62.0</td>
          <td>61.0</td>
          <td>61.0</td>
          <td style="font-weight: bold;">65.4</td>
          <td style="font-weight: bold;">65.4</td>
        </tr>
      </tbody>
    </table>
</div>

<div class="section">
    <h2 id="Efficiency">Efficiency</h2>
    <p>We report the best performance of different models between TreeSatAI and TreeSatAI-TS, with pre-training and fine-tuning using 100% of labels. 
      The area of the markers is proportional to the training time, broken down in pre-training and fine-tuning when applicable. 
      OmniSat is more compact, faster to train, and performs better than all evaluated models, including the DOFA foundation model.</p>
    <p align="center">
      <img src="https://github.com/user-attachments/assets/0e6a378a-024a-4224-ad1d-fa7171df5adf" width="800" height="350">
    </p>
</div>
