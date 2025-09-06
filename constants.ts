
import type { Preset } from './types';

export const PRESETS: Record<string, Preset> = {
  "pixel-art-16bit": {
    name: "16-bit Pixel Art",
    systemPrompt: "Generate pixel art game asset in 16-bit retro style. Use limited color palette with clean pixel edges. Make it suitable for indie games. Output as seamless tiled pattern image if applicable.",
    defaultText: "medieval stone floor tile"
  },
  
  "vector-flat": {
    name: "Flat Vector Art",
    systemPrompt: "Create clean vector-style 2D game asset with flat colors, minimal gradients, geometric shapes. Style similar to modern mobile games. Ensure crisp edges and bold colors.",
    defaultText: "cartoon tree sprite"
  },
  
  "hand-drawn": {
    name: "Hand Drawn Style",
    systemPrompt: "Generate hand-drawn illustrated game asset with organic lines, sketch-like quality, watercolor or pencil texture. Make it feel artistic and unique.",
    defaultText: "fantasy potion bottle"
  },
  
  "seamless-texture": {
    name: "Seamless Tiled Texture",
    systemPrompt: "Create seamless tiled pattern image of the described texture. Ensure perfect tiling on all edges with no visible seams. Make it suitable for 3D game environments.",
    defaultText: "worn wooden planks"
  },
  
  "skybox-cubemap": {
    name: "Skybox (Cubemap)",
    systemPrompt: "Generate seamless cubemap for game skybox. Create 360-degree environment that aligns perfectly when viewed in all directions. High detail, atmospheric.",
    defaultText: "sunset over alien desert landscape"
  },
  
  "skybox-equirect": {
    name: "Skybox (Equirectangular)",
    systemPrompt: "Create seamless equirectangular projection for game skybox. Ensure no distortion at poles and perfect horizontal wrapping. Photorealistic quality.",
    defaultText: "starfield with nebula"
  }
};
