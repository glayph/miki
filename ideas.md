# Agent Miki — Design Exploration

## Three directions

### 1. Quiet Runtime
**Very Brief Intro:** A warm-white product site where typography, spacing, and single-pixel rules carry the brand. The feeling is calm, exact, and dependable.

**Probability:** 0.07

### 2. Mono Terminal
**Very Brief Intro:** A black-and-white developer-tool composition with terminal fragments and technical labels. It feels faster and more utilitarian, but intentionally restrained.

**Probability:** 0.03

### 3. Editorial System
**Very Brief Intro:** A publication-like layout with oversized statements, asymmetric columns, and generous margins. It makes Agent Miki feel thoughtful and highly considered.

**Probability:** 0.09

## Chosen direction: Quiet Runtime

### Design Movement
Swiss editorial minimalism combined with a contemporary developer-tool interface.

### Core Principles
1. Typography is the primary visual object; every section begins with a clear statement.
2. White space is functional, not empty: it separates decisions and focuses attention.
3. One strong black action is more useful than many competing controls.
4. Interface detail is expressed through fine rules, light neutral surfaces, and precise alignment—not decoration.

### Color Philosophy
The canvas is warm white (`#FAFAFA`) to avoid a harsh sterile page. Ink is near-black (`#111111`) for confident readability. Cool gray (`#6C6C6C`) carries secondary explanation and pale gray (`#E8E8E8`) carries structure. Black is the single dominant action color. No gradients are permitted.

### Layout Paradigm
The website uses an off-center editorial spine rather than a centered marketing stack. Home is a left-weighted statement paired with a right-side runtime panel. About uses a narrow reading column inside a wide empty field. Features use a numbered rail. Contact uses an asymmetric invitation/form split.

### Signature Elements
1. A small square Agent Miki mark paired with a wordmark in the header.
2. Hairline horizontal rules that create rhythm between sections.
3. Low-information runtime blocks—precise, text-first, and intentionally sparse.

### Interaction Philosophy
All interactions are direct and calm. Buttons provide a small press response, navigation has clear active states, and the contact form gives specific inline validation. Nothing bounces, glows, or asks for attention without a user action.

### Animation
Use short 150–220ms opacity and transform transitions only. Content can gently settle into place once; hover states shift by at most 1–2px. Disable non-essential motion for `prefers-reduced-motion`.

### Typography System
Geist Sans is the primary typeface, with a system fallback. Headlines use 600–650 weight with tight negative tracking; body text uses 400–450 weight and comfortable line height. Tiny operational labels use a monospace fallback stack in uppercase with broad tracking.

### Brand Essence
**Positioning:** Agent Miki is a quiet autonomous runtime for people who need work to continue with clarity across systems.

**Personality:** Precise, calm, capable.

### Brand Voice
Headlines are declarative and compact. CTAs are action-oriented without hype. Microcopy is factual and low-volume.

Examples: “Work that keeps moving.” and “Start a conversation.”

### Wordmark & Logo
The mark is an abstract black modular “m” glyph made from rectangular strokes. The wordmark pairs `{AGENT}` with a small `MIKI` detail rather than relying on a default text treatment.

### Signature Brand Color
**Runtime Black — `#111111`**

## Style Decisions

- The header lockup uses the modular mark with `{AGENT}` and `MIKI` in deliberately contrasting operational typography; plain title-case branding is not used.
- Features are expressed as a numbered runtime capability rail rather than a SaaS-style card grid.
- Every route carries one sparse runtime signal—sequence marker, state label, or technical rule—so the product character stays present without adding noise.
- Subpages use distinct editorial compositions: a wide field plus narrow mission column on About, a sequential system rail on Features, and an offset invitation/form relationship on Contact.
