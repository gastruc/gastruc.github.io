---
title: "OmniSat: Self-Supervised Modality Fusion for Earth Observation"
collection: publications
permalink: /publication/omnisat
excerpt: 'The field of Earth Observations (EO) offers a wealth of data from diverse sensors, presenting a great opportunity for advancing self-supervised multimodal learning. However, current multimodal EO datasets and models focus on a single data type, either mono-date images or time series, which limits their expressivity. We introduce OmniSat, a novel architecture that exploits the spatial alignment between multiple EO modalities to learn expressive multimodal representations without labels. To demonstrate the advantages of combining modalities of different natures, we augment two existing datasets with new modalities. As demonstrated on three downstream tasks: forestry, land cover classification, and crop mapping. OmniSat can learn rich representations in an unsupervised manner, leading to improved performance in the semi- and fully-supervised settings, even when only one modality is available for inference. The code and dataset are available at github.com/gastruc/OmniSat..'
date: 2024-04-12
venue: 'Arxiv preprint'
paperurl: 'http://gastruc.github.io/files/omnisat.pdf'
teaser: 'https://github.com/gastruc/OmniSat/assets/1902679/9fc20951-1cac-4891-b67f-53ed5e0675ad'
projectpage: 'http://gastruc.github.io/projects/omnisat.html'
---

# OmniSat: Self-Supervised Modality Fusion for Earth Observation

## Description

### Abstract

We introduce OmniSat, a novel architecture that exploits the spatial alignment between multiple EO modalities to learn expressive multimodal representations without labels. We demonstrate the advantages of combining modalities of different natures across three downstream tasks (forestry, land cover classification, and crop mapping), and  propose two augmented datasets with new modalities: PASTIS-HD and TreeSatAI-TS.

<p align="center">
  <img src="https://github.com/gastruc/OmniSat/assets/1902679/9fc20951-1cac-4891-b67f-53ed5e0675ad" width="500" height="250">
</p>

### Datasets

  
| Dataset name  |             Modalities                   |      Labels         |     Link      
| ------------- | ---------------------------------------- | ------------------- | ------------------- |
| PASTIS-HD     | **SPOT 6-7 (1m)** + S1/S2 (30-140 / year)| Crop mapping (0.2m) |    [huggingface](https://huggingface.co/datasets/IGNF/PASTIS-HD) or [zenodo](https://zenodo.org/records/10908628) |
| TreeSatAI-TS  | Aerial (0.2m) + **S1/S2 (10-70 / year)** |   Forestry (60m)    |   [huggingface](https://huggingface.co/datasets/IGNF/TreeSatAI-Time-Series) |
| FLAIR         |   aerial (0.2m) + S2 (20-114 / year)     |  Land cover (0.2m)  |  [huggingface](https://huggingface.co/datasets/IGNF/FLAIR) |


<p align="center">
  <img src="https://github.com/gastruc/OmniSat/assets/1902679/289c8ca5-c0fa-4c35-8a91-af827dac0509" width="500" height="250">
</p>

### Results

We perform experiments with 100% and 10-20% of labels. See below, the F1 Score results on 100% of the training data with all modalities available:

|   F1 Score    | UT&T | Scale-MAE | OmniSat (no pretraining) | OmniSat (with pretraining) |
| ------------- | ---- | --------- | ------------------------ | -------------------------- |
| PASTIS-HD     | 53.5 |   42.2    |           59.1           |          **69.9**          |
| TreeSatAI-TS  | 56.7 |   60.4    |           73.3           |          **74.2**          |
| FLAIR         | 48.8 |   70.0    |           70.0           |          **73.4**          |

OmniSat also improves performance even when only one modality is available for inference.
F1 Score results on 100% of the training data with only S2 data available:

|   F1 Score    | UT&T | Scale-MAE | OmniSat (no pretraining) | OmniSat (with pretraining) |
| ------------- | ---- | --------- | ------------------------ | -------------------------- |
| PASTIS-HD     | 61.3 |   46.1    |           60.1           |          **70.8**          |
| TreeSatAI-TS  | 57.0 |   31.5    |           49.7           |          **62.9**          |
| FLAIR         | 62.0 |   61.0    |         **65.4**         |          **65.4**          |



### Efficiency

We report the best performance of different models between TreeSatAI and TreeSatAI-TS, with pre-training and fine-tuning using 100% of labels. The area of the markers is proportional to the training time, broken down in pre-training and fine-tuning when applicable

<p align="center">
   <img src="http://gastruc.github.io/images/Efficiency.png" width="350" height="250">
</p>
