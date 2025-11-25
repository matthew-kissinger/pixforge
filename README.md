<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PixForge - AI Game Asset Generator

Generate game assets using Gemini AI with an intuitive canvas-based interface. Draw your ideas and let AI bring them to life!

**Built with:** React 19, Vite, TypeScript, Tailwind CSS, tldraw, and Google Gemini AI

**View in AI Studio:** https://ai.studio/apps/drive/1JS_27n1kgEZeYWvMOfafq-ouli8-Y6R2

## Features

- 🎨 **Canvas Drawing** - Draw your concepts using tldraw
- 🤖 **AI Generation** - Transform sketches into polished game assets
- 🎭 **Scene Management** - Organize and manage multiple assets
- ✏️ **Asset Editor** - Edit and refine generated assets
- 📝 **Custom Prompts** - Fine-tune generation with preset prompts
- 🎨 **Color Palette Tools** - Extract and apply color schemes

## Prerequisites

- **Node.js** 20 or higher
- **Gemini API Key** - Get one at [https://ai.google.dev/](https://ai.google.dev/)

## Run Locally

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd pixforge
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
pixforge/
├── components/          # React components
│   ├── Header.tsx
│   ├── ConstrainedCanvas.tsx
│   ├── ColorPalette.tsx
│   └── ...
├── pages/              # Page components
│   ├── CanvasPage.tsx
│   ├── PromptsPage.tsx
│   ├── AssetEditorPage.tsx
│   └── ScenesPage.tsx
├── services/           # API services
│   └── geminiService.ts
├── state/              # Zustand stores
│   ├── prompts.ts
│   └── scenes.ts
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4
- **Drawing:** tldraw
- **State:** Zustand
- **Routing:** React Router
- **UI:** Radix UI components
- **AI:** Google Gemini 2.5 Flash with image generation

## Contributing

Contributions are welcome! Please ensure you don't commit any API keys or sensitive data.

## License

MIT
