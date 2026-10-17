# Physics Prasanth — Google Drive Bulk Import & Synchronisation Guide

## 1. Overview

The **Physics Prasanth** presentation portal provides a data-driven teaching system supporting all chapters and topic-wise presentation files for CBSE Class 11 and Class 12.

Source presentation files (`.pptx`) are organised inside Google Drive folders. The administrative synchronization tool (`admin_import_drive.cjs`) and normalized content catalogue (`data/catalogue.json` and `data/catalogue.js`) ensure that presentations are mapped to a structured curriculum hierarchy without requiring manual link copying.

---

## 2. Google Drive Hierarchy & Verified Folder IDs

The portal maps the Google Drive structure directly into the web application:

```
PRASANTH PPTS 11 AND 12 (Root Folder: 1-QYqotGLmES-qK9chS2ChHPSedHbJpzg)
├── 12th-phy (Class 12 Root: 1j0IU6IarkuTuGs9fmFV8gXHzjM7kXreB)
│   ├── 01. Electric Charges and Fields (12 modules)
│   ├── 02. Electrostatic Potential & Capacitance (11 modules)
│   ├── 03. Current Electricity (16 modules)
│   ├── 04. Moving Charges and Magnetism (11 modules)
│   ├── 05. Magnetism and Matter (12 modules)
│   ├── 06. Electromagnetic Induction (14 modules)
│   ├── 07. Alternating Current (10 modules)
│   ├── 08. Electromagnetic Waves (8 modules)
│   ├── 09. Ray Optics & Optical Instruments (11 modules)
│   ├── 10. Wave Optics (14 modules)
│   ├── 11. Dual Nature of Radiation & Matter (14 modules)
│   ├── 12. Atoms (12 modules)
│   ├── 13. Nuclei (12 modules)
│   ├── 14. Semiconductor Electronics (15 modules)
│   └── 15. Communication Systems (16 modules)
└── 11th-phy (Class 11 Root: 1VtbHuTTbz3_cyCBhMDxxC3vk_UiGSXxe)
    ├── 01. Physical World (3 modules)
    ├── 02. Units and Measurements (10 modules)
    ├── 03. Motion in a Straight Line (7 modules)
    ├── 04. Motion in a Plane (5 modules)
    ├── 05. Laws of Motion (18 modules)
    ├── 06. Work, Energy and Power (3 modules)
    ├── 07. Rotational Motion & Center of Mass (4 modules)
    ├── 08. Gravitation (7 modules)
    ├── 09. Mechanical Properties of Solids (7 modules)
    ├── 10. Mechanical Properties of Fluids (11 modules)
    ├── 11. Thermal Properties of Matter (19 modules)
    ├── 12. Thermodynamics (13 modules)
    ├── 13. Kinetic Theory of Gases (10 modules)
    ├── 14. Oscillations (14 modules)
    └── 15. Waves (13 modules)
```

**Total Modules Catalogued:** 332 verified PowerPoint presentations.

---

## 3. Administrative CLI Tool (`admin_import_drive.cjs`)

The pipeline includes an administrative command-line utility for managing, verifying, and exporting the content catalogue.

### Command Reference

| Command | Description |
| :--- | :--- |
| `node admin_import_drive.cjs --stats` | Displays real-time summary statistics across both classes, all 30 chapters, and all 332 modules. |
| `node admin_import_drive.cjs --verify` | Tests HTTP responsiveness for sample chapter anchor presentation endpoints. |
| `node admin_import_drive.cjs --export-csv` | Generates a flat `catalogue_export.csv` containing class, chapter, topic title, file ID, and embed URLs. |
| `node admin_import_drive.cjs --help` | Displays command options and usage instructions. |

---

## 4. Security & Access Model

1. **Server-Side Credentials**:
   - Privileged OAuth / Service Account keys or API keys must remain strictly on the server or in local administrative scripts (`GDRIVE_API_KEY`, `GDRIVE_SERVICE_ACCOUNT`).
   - Client-side assets (`data/catalogue.js`) only contain public delivery IDs and normalized embed URLs.

2. **Download Prevention**:
   - Standard `/view` and `/preview` endpoints present visible download, print, and popout buttons.
   - The verified Google Slides Office endpoint:
     `https://docs.google.com/presentation/d/{FILE_ID}/embed?start=false&loop=false&delayms=3000&rtpof=true&sd=true`
     runs the native slideshow engine inside an isolated iframe sandboxed against direct file downloads.

3. **In-Memory Annotation Security**:
   - All annotations drawn by teachers exist strictly in browser session memory.
   - Ink coordinates are never written back to the source Google Drive folders.

---

## 5. Adding New Chapters or Refreshing Presentations

When files in Google Drive are modified, added, or reordered:
1. Update folder contents in Google Drive.
2. Note the Google Drive file ID (the alphanumeric string between `/d/` and `/` in the share link).
3. Add the entry to `data/catalogue.json`.
4. Re-compile the client-side module by running `node admin_import_drive.cjs --stats` (or `node convert_catalogue.cjs`).
5. Deploy changes to Vercel (`git add .`, `git commit -m "Update catalogue"`, `git push origin main`).
