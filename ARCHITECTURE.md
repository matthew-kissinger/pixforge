# PixForge Architecture Documentation

## Overview
PixForge is a game asset generator powered by Gemini AI, specializing in pixel art creation and editing. It's a React-based web application that transforms sketches, images, or text descriptions into professional pixel art sprites, tiles, and backgrounds using advanced AI models.

## Project Structure

```
pixforge/
├── public/
│   └── vite.svg
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── editor/                 # Asset editor components
│   ├── icons/                  # Icon components
│   └── [core components]       # Main app components
├── pages/                      # Route pages
├── state/                      # Zustand state stores
├── services/                   # AI API integration
├── utils/                      # Utility functions
├── lib/                        # Library utilities
└── [config files]             # Build & config files
```

## Technology Stack

### Core Framework
- **React**: ^19.1.1 (Latest version with modern features)
- **TypeScript**: ~5.8.2 (Type safety and developer experience)
- **Vite**: ^6.2.0 (Build tool and dev server)

### Routing
- **react-router-dom**: ^6.28.0 (Client-side routing)

### State Management
- **Zustand**: ^5.0.2 (Lightweight state management)
- Stores: artifacts, prompts, editor state

### UI Framework & Styling
- **TailwindCSS**: ^4.1.13 (Utility-first CSS framework)
- **Radix UI**: Multiple components for accessible UI primitives
  - `@radix-ui/react-dialog`: ^1.1.15
  - `@radix-ui/react-select`: ^2.2.6
  - `@radix-ui/react-separator`: ^1.1.7
  - `@radix-ui/react-slot`: ^1.2.3
  - `@radix-ui/react-tabs`: ^1.1.13
- **shadcn/ui**: Component library built on Radix UI
- **lucide-react**: ^0.542.0 (Icon library)
- **class-variance-authority**: ^0.7.1 (Variant-based styling)
- **tailwind-merge**: ^3.3.1 (Merge Tailwind classes)
- **tailwindcss-animate**: ^1.0.7 (Animation utilities)

### AI Integration
- **@google/genai**: ^1.16.0 (Google Gemini AI SDK)
- Model: `gemini-2.5-flash-image-preview` (Vision model for image generation/editing)

### Drawing & Canvas
- **tldraw**: ^3.15.4 (Infinite canvas with drawing tools)

### Build Tools & Development
- **@vitejs/plugin-react**: ^5.0.2 (React plugin for Vite)
- **@tailwindcss/vite**: ^4.1.13 (TailwindCSS Vite plugin)
- **autoprefixer**: ^10.4.21 (CSS vendor prefixes)
- **postcss**: ^8.5.6 (CSS processing)

## Application Architecture

### 1. Application Entry Point
- **index.html**: HTML template with Tailwind CDN and importmap for external dependencies
- **index.tsx**: React app mounting point with StrictMode
- **App.tsx**: Main application component with routing setup

### 2. Routing Structure
```typescript
Routes:
├── "/" → redirect to "/canvas"
├── "/canvas" → CanvasPage (Drawing and generation)
├── "/prompts" → PromptsPage (Prompt management)
└── "/editor" → AssetEditorPage (Asset editing)
```

### 3. State Management Architecture

#### Artifacts Store (`state/artifacts.ts`)
```typescript
interface ArtifactsState {
  artifacts: GenerationResult[];      // Generated images history
  addArtifact: (result: GenerationResult) => void;
  removeArtifact: (id: string) => void;
  clearArtifacts: () => void;
  getLatestArtifacts: (count: number) => GenerationResult[];
}
```

#### Prompts Store (`state/prompts.ts`)
```typescript
interface PromptsState {
  presets: PromptPreset[];            // AI prompt templates
  activePresetId: string | null;      // Currently selected preset
  // CRUD operations for presets
}
```

#### Editor Store (`state/editor.ts`)
```typescript
interface EditorState {
  selectedAssets: GenerationResult[];  // Assets selected for editing
  canvas: EditorCanvas | null;         // Drawing canvas state
  isCanvasSelected: boolean;           // Canvas selection state
  currentCommand: string;              // Current editing command
  isEditing: boolean;                  // Edit operation in progress
  editHistory: GenerationResult[];    // Edit operation history
}
```

### 4. AI Generation System

#### Core Service (`services/geminiService.ts`)
- **Primary Function**: `generateAssetFromInput()` - Main generation pipeline
- **Model**: `gemini-2.5-flash-image-preview`
- **Input Types**: Blob (images) or string (URLs)
- **Validation**: Size and transparency checking with retry logic
- **Multi-asset Editing**: `editAssets()` for batch processing

#### Prompt System (`constants.ts`)
Extensive prompt presets for different asset types:
- **96x96 Pixel Sprite**: Detailed character sprites
- **64x64 Detailed Sprite**: High-detail characters
- **32x32 Classic Sprite**: Retro-style sprites  
- **16x16 Micro Sprite**: Ultra-compact sprites
- **128x128 Character Portrait**: Detailed character faces
- **32x32 Seamless Tile**: Tileable textures
- **16x16 Pattern Tile**: Micro-pattern tiles
- **24x24 Game Icon**: UI/inventory icons
- **256x144 Game Background**: Scene backgrounds

Each preset includes:
- System prompts with technical requirements
- User template with creative direction
- Variable system for customization
- Constraints (size, transparency, palette)
- Generation parameters (temperature, etc.)

### 5. Component Architecture

#### Pages
- **CanvasPage**: Main drawing interface with tldraw integration
- **PromptsPage**: Prompt preset management interface
- **AssetEditorPage**: Multi-asset editing workspace

#### Core Components
- **Header**: Navigation and app title
- **GenerationControls**: Preset selection and generation triggers
- **OutputPanel**: Display and management of generated assets
- **HistoryPanel**: Generation history and asset browser
- **AssetSelector**: Multi-select interface for assets
- **EditorControls**: Asset editing command interface
- **ConstrainedCanvas**: Size-constrained drawing canvas
- **EditorCanvases**: Multi-canvas editing workspace

#### UI Components (shadcn/ui)
Standard component library including:
- Button, Card, Tabs, Badge, Sheet
- Textarea, Skeleton, Select, Separator
- All components use Radix UI primitives with Tailwind styling

### 6. Utility Systems

#### Image Processing (`utils/image.ts`)
```typescript
// Core image utilities
blobToImageData(blob: Blob): Promise<ImageData>
validateAlphaAndSize(): Promise<boolean>  // Size/transparency validation
blobToBase64(blob: Blob): Promise<string>
base64ToBlob(base64: string): Promise<Blob>
```

#### Prompt Processing (`utils/prompt.ts`)
```typescript
// Template rendering system
renderPrompt(preset: PromptPreset, vars: Record<string, string>)
renderStrictSuffix(preset: PromptPreset, vars: Record<string, string>)
```

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2022 with experimental decorators
- **Module**: ESNext with bundler resolution
- **Path mapping**: `@/*` → root directory
- **JSX**: react-jsx mode
- **Library**: DOM, DOM.Iterable, ES2022

### Vite Configuration (`vite.config.ts`)
- **Plugins**: React, TailwindCSS
- **Environment**: Dynamic API key injection
- **Aliases**: `@` mapped to project root
- **Mode**: Development with hot reload

### TailwindCSS (`tailwind.config.js`)
- **Version**: 4.1.13 (Latest)
- **Content**: All JS/TS/JSX/TSX files
- **Theme**: Extended with shadcn/ui design tokens
- **Dark mode**: Class-based switching
- **Plugins**: tailwindcss-animate for animations

### PostCSS (`postcss.config.js`)
```javascript
plugins: {
  '@tailwindcss/postcss': {},
  autoprefixer: {}
}
```

### shadcn/ui Configuration (`components.json`)
- **Style**: default theme
- **Base color**: slate
- **CSS variables**: enabled
- **Component paths**: `@/components/ui`

## Data Flow Architecture

### 1. Asset Generation Flow
```
User Input (Canvas/Text) 
→ Preset Selection 
→ Variable Substitution 
→ Gemini API Call 
→ Validation & Retry Logic 
→ Result Storage 
→ UI Update
```

### 2. Asset Editing Flow
```
Asset Selection 
→ Command Input 
→ Multi-image Preparation 
→ Gemini Edit API 
→ Result Processing 
→ History Update 
→ UI Refresh
```

### 3. State Synchronization
- **Zustand**: Reactive state updates across components
- **Local Storage**: Persistent state for user preferences
- **Memory Management**: Automatic cleanup (50 artifacts, 20 edit history)

## API Integration

### Gemini AI Configuration
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
model: 'gemini-2.5-flash-image-preview'
responseModalities: [Modality.IMAGE, Modality.TEXT]
```

### Environment Variables
- **GEMINI_API_KEY**: Primary API key
- **API_KEY**: Fallback API key
- Loaded via Vite's `loadEnv()` with runtime injection

## Build & Development

### Development Scripts
```json
{
  "dev": "vite",           // Development server with HMR
  "build": "vite build",   // Production build
  "preview": "vite preview" // Production preview
}
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type checking and IntelliSense
- **ESLint**: Code quality and consistency
- **Path Aliases**: Clean import statements
- **Environment Variables**: Secure API key handling

## Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based lazy loading potential
- **Tree Shaking**: Automatic unused code removal
- **Asset Optimization**: Vite's built-in optimizations

### Memory Management
- **Artifact Limit**: 50 maximum stored generations
- **Edit History**: 20 maximum edit operations
- **Blob Handling**: Efficient image data management

### API Efficiency
- **Retry Logic**: Smart validation with fallback prompts
- **Batch Processing**: Multi-asset editing in single calls
- **Response Caching**: Browser-level HTTP caching

## Security Considerations

### API Security
- **Environment Variables**: API keys never exposed to client
- **HTTPS**: All API communications encrypted
- **Input Validation**: User input sanitization

### Content Security
- **Blob Handling**: Safe image processing
- **CORS**: Proper cross-origin handling
- **XSS Prevention**: React's built-in protections

## Deployment Architecture

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── [hash].js      # Application bundle
│   ├── [hash].css     # Styled bundle
│   └── [hash].woff2   # Font assets
└── vite.svg
```

### Environment Requirements
- **Node.js**: 18+ for development
- **Modern Browser**: ES2022 support required
- **API Access**: Valid Gemini API key
- **HTTPS**: Required for production deployment

## Extensibility Points

### Adding New Asset Types
1. Add preset to `constants.ts`
2. Update type definitions in `types.ts`
3. Add UI controls in generation components
4. Test with validation system

### Custom Prompts
1. Extend `PromptPreset` interface if needed
2. Add to prompts store
3. Create UI for preset management
4. Implement variable substitution

### Additional AI Models
1. Extend service layer abstraction
2. Add model selection UI
3. Update configuration system
4. Implement model-specific optimizations

## Development Setup Instructions

### Prerequisites
```bash
Node.js 18+
npm or yarn package manager
Valid Gemini AI API key
```

### Installation
```bash
git clone [repository]
cd pixforge
npm install
```

### Environment Setup
```bash
# Create .env.local
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

### Development
```bash
npm run dev  # Start development server
# Navigate to http://localhost:5173
```

### Production Build
```bash
npm run build   # Create production build
npm run preview # Preview production build
```

This architecture enables PixForge to efficiently generate, edit, and manage game assets using cutting-edge AI technology while maintaining excellent performance and user experience.