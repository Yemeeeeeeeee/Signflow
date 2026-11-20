🚀 Project: SignatureFlow - Online Signature Animation Generator
🎯 1. Role & Objective (角色与目标)
You are an expert Frontend Engineer. Your task is to build a web-based tool that converts user input text into static signature images and dynamic handwriting animation (left-to-right reveal).
Focus on P0 (MVP) features first. Write clean, modular, and highly readable TypeScript code. Prefer functional components and React Hooks.

🛠 2. Tech Stack (技术栈要求)
Framework: React 18+ (Vite) + TypeScript

Styling: TailwindCSS + shadcn/ui (for fast, beautiful components)

State Management: Zustand (lightweight and easy for AI to implement)

Font Parsing: opentype.js (crucial for text-to-SVG path conversion)

Animation: CSS Animations + SVG <mask> / clipPath (MVP)

Exporting:

Static: Canvas API (toBlob) for PNG, raw SVG for vector.

Dynamic: MediaRecorder API for WebM, gif.js for GIF.

📐 3. Data Models (数据模型 - TypeScript Interfaces)
Define these types in types/index.ts. Use them strictly across the app.

typescript
// Font Item
export interface FontItem {
  id: string;
  name: string;
  url: string; // Path to .ttf or .woff2
  license: 'personal' | 'commercial' | 'unknown';
  style: 'elegant' | 'modern' | 'retro';
}

// Canvas & Signature Configuration
export interface SignatureConfig {
  text: string; // max 30 chars
  fontId: string;
  fontColor: string; // hex code
  backgroundColor: string | 'transparent';
  fontSize: number;
  letterSpacing: number;
  canvasWidth: number;
  canvasHeight: number;
}

// Animation Configuration
export interface AnimationConfig {
  isPlaying: boolean;
  speed: number; // 0.5 to 3.0
  loop: boolean;
  delayBetweenChars: number; // ms
  penTipStyle: 'none' | 'dot' | 'pen';
}
🌳 4. Component Architecture (组件树)
AI should build the app using this structure:

App.tsx (Layout: Header + 3 Columns)

ControlPanel.tsx (Left Column)

TextInput.tsx (Validates max 30 chars, only English/numbers)

FontSelector.tsx (Grid of font cards. Loads fonts dynamically)

StyleSettings.tsx (Color pickers, background toggles, size sliders)

AnimationSettings.tsx (Speed slider, loop toggle, play/pause buttons)

PreviewArea.tsx (Center Canvas)

SVGCanvas.tsx (The actual rendering engine. Renders SVG paths)

PlaybackControls.tsx (Bottom toolbar for animation)

ExportModal.tsx (Right / Popup)

FormatSelector.tsx (PNG, SVG, GIF, WebM)

ExportButton.tsx (Handles generation and downloading)

🧠 5. Core Algorithms & Logic (核心逻辑 - 必读)
5.1 Static Generation (Text to SVG)
Use opentype.js to load the selected font.

Convert the text into a single SVG <path> using font.getPath().

Render this path inside an <svg> element. Ensure the viewBox fits the path bounding box.

5.2 Dynamic Animation (MVP - Mask Reveal)
To simulate handwriting from left to right, do not use complex path tracing for the MVP. Use SVG Masking:

Wrap the generated <path> inside a <g> group.

Apply a <mask id="reveal-mask"> to this group.

Inside the mask, create a <rect> with the same dimensions as the canvas. Fill it with white.

Animate the <rect>'s width from 0 to 100% using CSS or Web Animations API.

For multi-character animation: Split the text into individual <path> elements (one per character) and stagger their animation delays (delayBetweenChars).

5.3 Export Logic
PNG: Render SVG to an offscreen <canvas> using XMLSerializer and Image, then canvas.toBlob().

WebM (Transparent): Use MediaRecorder on a canvas with alpha: true.

GIF: Use gif.js by capturing frames from the canvas. (Note: GIF does not support partial transparency well, warn the user or default to a white background).

📝 6. Step-by-Step Implementation Plan (For AI Prompts)
Please execute the development in the following phases. Do not skip ahead.

Phase 1: Setup & Layout (P0)
Initialize Vite + React + TS + Tailwind.

Install opentype.js, zustand, lucide-react (for icons).

Create the 3-column layout. Implement the Zustand store with SignatureConfig and AnimationConfig.

Phase 2: Fonts & Static Rendering (P0)
Create a mock fonts array (use Google Fonts or local .ttf for testing).

Implement SVGCanvas.tsx. Use opentype.js to convert the user's text into an SVG path and render it.

Implement text input validation (limit to 30 English chars).

Implement style changes (color, bg, font size) updating the SVG in real-time.

Phase 3: Animation Engine (P0)
Implement the Mask Reveal animation logic in SVGCanvas.tsx.

Add Play/Pause/Loop controls.

Add speed control (adjust CSS animation duration).

Phase 4: Export Functionality (P0)
Implement PNG export (SVG -> Canvas -> Blob).

Implement SVG export (Download raw SVG string).

Implement WebM export (Using MediaRecorder).

Phase 5: Polish & Edge Cases (P1)
Add a "Commercial Use" warning banner if the selected font license is unknown (like The Billion Monoline).

Handle empty inputs gracefully.

Add loading skeletons while fonts are fetching.

⚠️ 7. Constraints & Guidelines for AI
Strictly English: The MVP only supports English, numbers, and basic punctuation (.'-&).

No Backend: Everything must run client-side in the browser.

Performance: Throttle real-time updates (e.g., text input) if the path generation gets slow.

Styling: Use Tailwind utility classes. Do not write custom CSS files unless absolutely necessary. Keep the UI clean, modern, and similar to Figma/Canva tools.

Error Handling: Always wrap opentype.js font loading and Canvas exporting in try/catch blocks and show user-friendly toasts.