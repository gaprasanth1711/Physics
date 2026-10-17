# Physics Prasanth — Presentation Viewer & Animation Compatibility Report

## 1. Executive Summary

The **Physics Prasanth** teaching portal fulfills two core requirements that previously conflicted:
1. **Preserving native PowerPoint step-by-step animations, builds, derivations, and transitions.**
2. **Blocking direct raw `.pptx` file downloads and eliminating static PDF flattening.**

This report documents the architectural decisions, renderer compatibility benchmarks, and the temporary pen-tablet annotation layer.

---

## 2. Presentation Rendering Engine Evaluation

| Rendering Strategy | Animation & Build Support | Download Protection | Rendering Fidelity | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **PDF Conversion / Rasterization** | ❌ No (Flattens all builds into static single images) | ⚠️ Partial (Can still save PDF) | ⚠️ Moderate (Loses embedded vectors and fonts) | **Rejected:** Destroys step-by-step Physics derivations. |
| **Google Drive `/preview` Endpoint** | ❌ No (Renders static canvas page previews) | ❌ Poor (Displays top download & print buttons) | ⚠️ Moderate (Static only) | **Rejected:** Flattens interactive animations. |
| **Direct Google Slides `/embed?id={ID}`** | ⚠️ Fails (Returns HTTP 500 on binary `.pptx` uploads) | N/A | N/A | **Incompatible** with raw PowerPoint binary uploads. |
| **Verified Google Slides Office Endpoint** (`rtpof=true&sd=true`) | ✅ **Full Native Support** (Executes PowerPoint builds on click/spacebar) | ✅ **Protected** (No download buttons exposed) | ✅ **High** (Native vector typography and animations) | **Adopted as Primary Engine.** |

### Verified Endpoint Pattern:
```
https://docs.google.com/presentation/d/{FILE_ID}/embed?start=false&loop=false&delayms=3000&rtpof=true&sd=true
```
- `rtpof=true`: Forces the Google Drive viewer to interpret the binary as a Microsoft Office Real-Time Presentation.
- `sd=true`: Enables standard document slideshow mode.
- `start=false&loop=false`: Prevents automatic slide advancement, giving full pacing control to the educator.

---

## 3. Teacher Temporary Annotation Canvas Architecture

### Problem Solved: Ink Drift on Window Resizing / Fullscreen
In standard web canvas implementations, drawing coordinates are captured in CSS pixels. When the browser window is resized, when sidebars are collapsed, or when the user enters fullscreen mode, existing ink shifts and detaches from the underlying presentation slide.

### Solution Implemented:
1. **Virtual Logical Coordinate Space (`1920x1080`)**:
   - The canvas element maintains a fixed internal resolution of `1920x1080` matching standard 16:9 widescreen presentation slides.
   - Screen coordinates from mouse, touch, or pen tablet events are dynamically mapped using `getBoundingClientRect()`:
     ```javascript
     const rect = canvas.getBoundingClientRect();
     const scaleX = canvas.width / rect.width;
     const scaleY = canvas.height / rect.height;
     const x = (event.clientX - rect.left) * scaleX;
     const y = (event.clientY - rect.top) * scaleY;
     ```
2. **Browse vs Annotate Dual-Mode Architecture**:
   - **Browse Mode** (`pointer-events: none` on canvas): Clicks pass directly through the canvas into the underlying presentation iframe. Teachers can click anywhere on the slide or press the spacebar to trigger the next animation step, bullet point, or equation derivation.
   - **Annotate Mode** (`pointer-events: auto` on canvas): The transparent canvas intercepts pointer events for drawing, highlighting, and erasing.
3. **Session-Only Memory Retention**:
   - Annotations are stored per topic in browser memory. Switching topics restores any drawings made during the current viewing session. No ink is ever written to the underlying presentation files or to Google Drive.

---

## 4. Hardware & Tablet Compatibility

- **Pen Tablets & Styluses (Wacom, Apple Pencil, XP-Pen, Huion)**:
  - Full support for `pointerdown`, `pointermove`, and `pointerup` events.
  - Recognizes pressure signals (`e.pressure`) when supported by the hardware.
- **Touchscreens (iPads, Android Tablets, Surface Pro)**:
  - `touch-action: none` prevents accidental page panning or pinch zooming while drawing.
- **Desktop & Laptop Keyboards**:
  - `B`: Switch to Browse mode.
  - `A`: Switch to Annotate mode.
  - `F`: Toggle Fullscreen mode.
  - `Ctrl + Z`: Undo stroke.
  - `Ctrl + Y`: Redo stroke.
  - `[` / `]`: Previous / Next presentation topic module.
