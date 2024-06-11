---
title: "OpenStreetView-5M: The Many Roads to Global Visual Geolocation"
collection: publications
permalink: /publication/osv5m
excerpt: 'Determining the location of an image anywhere on Earth is a complex visual task, which makes it particularly relevant for evaluating computer vision algorithms. Yet, the absence of standard, large-scale, open-access datasets with reliably localizable images has limited its potential. To address this issue, we introduce OpenStreetView-5M, a large-scale, open-access dataset comprising over 5.1 million geo-referenced street view images, covering 225 countries and territories. In contrast to existing benchmarks, we enforce a strict train/test separation, allowing us to evaluate the relevance of learned geographical features beyond mere memorization. To demonstrate the utility of our dataset, we conduct an extensive benchmark of various state-of-the-art image encoders, spatial representations, and training strategies. All associated codes and models can be found at https://github.com/gastruc/osv5m.'
date: 2024-04-29
venue: 'CVPR'
paperurl: 'http://academicpages.github.io/files/osv5m.pdf'
---

![teaser.png](./images/teaser.png)
# OpenStreetView-5M <br><sub>The Many Roads to Global Visual Geolocation 📍🌍</sub>

OpenStreetView-5M is the first large-scale open geolocation benchmark of streetview images.  
To get a sense of the difficulty of the benchmark, you can play our [demo](https://huggingface.co/spaces/osv5m/plonk).  
Our dataset was used in an extensive benchmark of which we provide the best model.  
For more details and results, please check out our [paper](https://arxiv.org/abs/2404.18873) and [project page](https://imagine.enpc.fr/~ioannis.siglidis/osv5m/).  

![benchmark.png](./images/benchmark.png)


### Citing 💫

```bibtex
@article{osv5m,
    title = {{OpenStreetView-5M}: {T}he Many Roads to Global Visual Geolocation},
    author = {Astruc, Guillaume and Dufour, Nicolas and Siglidis, Ioannis
      and Aronssohn, Constantin and Bouia, Nacim and Fu, Stephanie and Loiseau, Romain
      and Nguyen, Van Nguyen and Raude, Charles and Vincent, Elliot and Xu, Lintao
      and Zhou, Hongyu and Landrieu, Loic},
    journal = {CVPR},
    year = {2024},
  }
```
