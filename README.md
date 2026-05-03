# Vision Art AI — Frontend

**Vision Art AI** is an interactive platform that blends **computer vision** and **generative AI** to analyze, interpret, and reimagine artworks.  
It detects visual elements in paintings, identifies artistic styles, and generates poetic interpretations inspired by the composition.


System available on [Github Page](https://heigon77.github.io/VisionArtAI-Frontend/).

---

## ✨ Features

- **Multi-Class Object Detection**  
  Detects up to **134 distinct object categories** within artworks using a fine-tuned YOLOv8 model.

- **Art Style Classification**  
  Identifies artistic movements (e.g., *Impressionism, Baroque, Renaissance*) with confidence scoring.

- **AI-Generated Poetry**  
  Produces a unique poem based on detected elements and artistic style using **Qwen 2.5**.

- **Dual Visualization Mode**  
  Seamlessly switch between:
  - Original image
  - Annotated image with bounding boxes

- **Immersive UI/UX**  
  Editorial-inspired design featuring:
  - Dark theme
  - Elegant typography (*Cormorant Garamond*)
  - Smooth loading and transitions

---

## 🎥 Demo

### Real-Time Usage
![Demo Video](./demo/demo_video.gif)

---

## 🧠 AI Stack

- **YOLOv8**  
  Object detection trained on:
  - COCO Dataset  
  - DEArt Dataset (art-focused)

- **Style Classifier**  
  Custom-trained model for artistic movement recognition

- **Qwen 2.5 (1.5B)**  
  Large Language Model used for creative text generation

---

## 🛠️ Tech Stack

- **Angular 19+** — SPA architecture
- **TypeScript** — Strong typing and maintainability
- **SCSS** — Modern styling with variables and responsive layouts
- **RxJS** — Reactive state and loading management
- **REST API Integration** — Backend communication for AI inference

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Angular CLI

```bash
npm install -g @angular/cli
````

---

### Installation

```bash
npm install
```

---

### Development Server

```bash
ng serve
```

Open your browser at:

```
http://localhost:4200/
```

---

### Production Build

```bash
ng build --configuration production
```

---

## ⚙️ Application Flow

1. User uploads an image
2. Image preview is rendered instantly
3. Backend processes:

   * Object detection
   * Style classification
   * Poem generation
4. Frontend displays:

   * Annotated image
   * Detected objects ranked by confidence
   * Style prediction
   * Generated poem

---

## 🎯 Design Principles

* **Reactive UX** — Smooth loading with progressive feedback
* **Clarity First** — Clean separation between data, UI, and logic
* **Aesthetic Focus** — Designed to match artistic context
* **Extensibility** — Easy to plug new models or features

---

## 📌 Notes

* This frontend relies on a backend API for AI inference.
* Ensure the backend service is running and properly configured.

---

## 📜 License

GNU GENERAL PUBLIC LICENSE

---

## 🌐 Vision Art AI Ecosystem

This frontend is part of the broader **Vision Art AI** ecosystem, combining:

* Computer Vision
* Generative AI
* Artistic Interpretation

---
