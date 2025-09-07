
import type { PromptPreset } from './types';

export const PIXEL_PRESETS: PromptPreset[] = [
  {
    id: 'sprite-96',
    label: '96x96 Pixel Sprite',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Use the provided input (sketch, image, text, or concept) as creative inspiration and transform it into a polished, professional pixel art sprite. The input shows the basic concept - your job is to create the final, high-quality video game asset.

Think of this as going from concept to final game sprite. A stick figure knight becomes a detailed pixel warrior. A photo reference becomes stylized pixel art. Text description becomes visual reality with proper proportions, colors, and game-ready details.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Sprite artwork
- Style: {STYLE} pixel art with crisp 1-pixel edges, NO anti-aliasing or soft gradients
- Palette: Maximum {PALETTE_N} colors using {SHADING} shading
- Composition: Center the subject, no padding, no drop shadows

TRANSPARENCY REQUIREMENTS:
- Background must be completely empty/invisible (alpha = 0)
- Only the actual sprite/character should have visible pixels
- Character sprite centered in frame
- The sprite should appear to "float" with no background whatsoever

TRANSFORMATION STANDARDS:
- Interpret rough shapes as clean, game-ready sprites
- Add professional details, proper anatomy, and game aesthetics
- Transform sketchy lines into pixel-perfect edges
- Enhance basic concepts with {DETAIL_LEVEL} detail and {ANIMATION_READY} considerations
- Apply {STYLE_INFLUENCE} visual influences`,

    userTemplate: `CREATIVE BRIEF: Transform the provided input into a high-quality pixel art sprite of: "{USER_PROMPT}"

TRANSFORMATION APPROACH:
- Use input as inspiration, not literal copying
- Enhance and refine into professional game asset
- Add missing details that would be expected in final art
- Interpret any input type (sketch, photo, text) through pixel art lens

ART DIRECTION:
- Era: {STYLE} with {STYLE_INFLUENCE} influences
- Perspective: {CAMERA}
- Character Design: {CHARACTER_ARCHETYPE} with {PERSONALITY_TRAIT}
- Visual Treatment: {OUTLINE} + {SHADING} + {DETAIL_LEVEL}
- Color Story: {PALETTE_HINTS} with {COLOR_TEMPERATURE} temperature
- Polish Level: {FINISH_QUALITY}

TECHNICAL SPECS:
- Size: {W}x{H} pixels exactly
- Content: Clean sprite
- Colors: Maximum {PALETTE_N} colors  
- Edges: Pixel-perfect, no anti-aliasing
- Readability: Clear at native resolution
- Focus: Character artwork centered`,

    variables: {
      STYLE: ['AI choice - best fit', '16-bit console', 'NES 8-bit', 'Game Boy monochrome', 'SNES era', 'Neo Geo detailed', 'Arcade cabinet'],
      STYLE_INFLUENCE: ['AI choice - genre match', 'Japanese RPG', 'Western platformer', 'Fighting game', 'Shoot em up', 'Metroidvania', 'Roguelike'],
      CAMERA: ['AI choice - optimal angle', 'side-view profile', 'isometric 3/4', 'top-down', '3/4 front view', 'full front facing', 'dynamic angle'],
      CHARACTER_ARCHETYPE: ['AI choice - context appropriate', 'heroic protagonist', 'mysterious figure', 'cute mascot', 'intimidating enemy', 'wise mentor', 'comic relief'],
      PERSONALITY_TRAIT: ['AI choice - character match', 'confident stance', 'cautious posture', 'aggressive pose', 'friendly demeanor', 'stoic presence', 'playful energy'],
      OUTLINE: ['AI choice - style appropriate', 'no outline', '1px black outline', '1px dark outline', '2px bold outline', 'colored outline', 'selective outline'],
      SHADING: ['AI choice - depth appropriate', 'flat color blocks', 'simple cel shading', 'form shading', 'dramatic lighting', 'soft gradients', 'high contrast'],
      DETAIL_LEVEL: ['AI choice - size appropriate', 'minimalist clean', 'moderate detail', 'high detail', 'intricate patterns', 'battle-worn', 'pristine finish'],
      PALETTE_HINTS: ['AI choice - theme match', 'warm earth tones', 'cool blue-grays', 'vibrant primary colors', 'muted pastels', 'high contrast', 'metallic sheens', 'magical glowing', 'natural organic'],
      COLOR_TEMPERATURE: ['AI choice - mood match', 'warm', 'cool', 'neutral', 'mixed'],
      FINISH_QUALITY: ['AI choice - project fit', 'polished AAA game', 'indie charm', 'retro authentic', 'modern pixel art'],
      ANIMATION_READY: ['AI choice - context fit', 'static pose', 'animation-friendly', 'idle stance', 'action pose'],
      W: ['96'],
      H: ['96'],
      PALETTE_N: ['AI choice - optimal count', '6', '8', '12', '16', '20']
    },
    constraints: {
      transparentBG: true,
      targetSize: [96, 96],
      paletteColors: 12,
      avoid: ['gradients', 'anti-aliasing', 'drop shadows']
    },
    version: 1,
    active: true
  },
  
  {
    id: 'sprite-64',
    label: '64x64 Detailed Sprite',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Use the provided input as creative inspiration to craft a detailed, professional pixel art sprite. Transform any input type into a polished game asset with rich detail and personality.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Character sprite only
- Style: {STYLE} pixel art with {DETAIL_DENSITY} detail density
- Palette: Maximum {PALETTE_N} colors using {SHADING} techniques
- Animation: Consider {ANIMATION_CONTEXT} needs

SPRITE REQUIREMENTS:
- Clean character artwork
- Centered composition
- Game-ready sprite asset

ENHANCEMENT STANDARDS:
- Add professional game-ready details and polish
- Apply {ARTISTIC_FLAIR} artistic elements
- Ensure {CONTRAST_LEVEL} contrast for readability
- Use {TEXTURE_APPROACH} texture techniques`,

    userTemplate: `CREATIVE BRIEF: Transform input into detailed pixel art sprite: "{USER_PROMPT}"

DETAIL DIRECTION:
- Style Era: {STYLE} with {GENRE_INFLUENCE}
- Visual Density: {DETAIL_DENSITY} with {ARTISTIC_FLAIR}
- Character Mood: {EMOTION} with {POSE_ENERGY}
- Technical: {CONTRAST_LEVEL} + {SHADING} + {TEXTURE_APPROACH}
- Color Palette: {PALETTE_HINTS} in {PALETTE_HARMONY}
- Animation Context: {ANIMATION_CONTEXT}

SPECS: {W}x{H}px, centered sprite, max {PALETTE_N} colors`,

    variables: {
      STYLE: ['AI choice - detail optimized', '16-bit detailed', 'SNES quality', 'Neo Geo hi-res', 'Modern pixel', 'GBA crisp', 'PC-98 style'],
      GENRE_INFLUENCE: ['AI choice - context match', 'JRPG character', 'Platformer hero', 'Fighting game', 'Strategy unit', 'Puzzle mascot', 'Racing avatar'],
      DETAIL_DENSITY: ['AI choice - resolution fit', 'high detail', 'moderate detail', 'clean minimalist', 'ornate decorative', 'battle-scarred', 'pristine uniform'],
      ARTISTIC_FLAIR: ['AI choice - style enhanced', 'dramatic shadows', 'subtle highlights', 'color gradients', 'texture overlays', 'pattern details', 'clean shapes'],
      EMOTION: ['AI choice - character fit', 'confident', 'mysterious', 'friendly', 'intimidating', 'wise', 'energetic', 'calm', 'fierce'],
      POSE_ENERGY: ['AI choice - mood match', 'dynamic action', 'relaxed stance', 'ready position', 'casual pose', 'heroic posture', 'sneaky crouch'],
      CONTRAST_LEVEL: ['AI choice - visibility optimized', 'high contrast', 'medium contrast', 'soft contrast', 'dramatic lighting'],
      SHADING: ['AI choice - form appropriate', 'cel shading', 'form shading', 'rim lighting', 'ambient occlusion', 'flat colors', 'gradient shading'],
      TEXTURE_APPROACH: ['AI choice - material match', 'smooth surfaces', 'rough textures', 'fabric details', 'metal shine', 'organic patterns', 'geometric designs'],
      PALETTE_HINTS: ['AI choice - theme optimized', 'warm sunset', 'cool moonlight', 'vibrant tropical', 'muted earth', 'neon cyber', 'forest natural', 'desert sand', 'ocean depths'],
      PALETTE_HARMONY: ['AI choice - color theory', 'complementary', 'analogous', 'triadic', 'monochromatic', 'split-complementary'],
      ANIMATION_CONTEXT: ['AI choice - usage optimized', 'idle animation', 'walk cycle ready', 'attack frames', 'static portrait', 'turn-around ready'],
      W: ['64'],
      H: ['64'],
      PALETTE_N: ['AI choice - detail appropriate', '8', '12', '16', '24']
    },
    constraints: {
      transparentBG: true,
      targetSize: [64, 64],
      paletteColors: 16,
      avoid: ['over-dithering', 'muddy colors']
    },
    version: 1,
    active: true
  },

  {
    id: 'sprite-32',
    label: '32x32 Classic Sprite',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Create a classic, clean pixel art sprite from any input. Focus on iconic readability and timeless pixel art aesthetics that work at small scale.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Character sprite only
- Style: {STYLE} with {CLARITY_FOCUS} clarity
- Palette: Maximum {PALETTE_N} colors
- Readability: Must be clear at 1x zoom

SPRITE REQUIREMENTS:
- Clean character artwork
- Centered composition

CLASSIC STANDARDS:
- Every pixel counts at this small size
- Focus on silhouette strength and iconic shapes
- Use {COLOR_STRATEGY} color approach
- Apply {PIXEL_TECHNIQUE} pixel techniques`,

    userTemplate: `RETRO BRIEF: Create classic pixel sprite: "{USER_PROMPT}"

CLASSIC APPROACH:
- Era: {STYLE} with {RETRO_INFLUENCE}
- Clarity: {CLARITY_FOCUS} with {ICONIC_ELEMENTS}
- Colors: {PALETTE_HINTS} using {COLOR_STRATEGY}
- Technique: {PIXEL_TECHNIQUE} + {SHAPE_APPROACH}
- Character: {ARCHETYPE} with {CLASSIC_TRAIT}

CONSTRAINTS: {W}x{H}px, max {PALETTE_N} colors, transparent`,

    variables: {
      STYLE: ['AI choice - retro authentic', '8-bit NES', 'Game Boy DMG', 'C64 style', 'Atari 2600', 'MSX computer', 'ZX Spectrum'],
      RETRO_INFLUENCE: ['AI choice - era appropriate', 'arcade cabinet', 'home console', 'computer game', 'handheld system'],
      CLARITY_FOCUS: ['AI choice - readability first', 'silhouette strong', 'high contrast', 'bold shapes', 'clean lines'],
      ICONIC_ELEMENTS: ['AI choice - memorable design', 'simple symbols', 'recognizable pose', 'distinctive colors'],
      COLOR_STRATEGY: ['AI choice - constraint optimized', 'limited palette', 'high contrast', 'color coding', 'monochrome plus accent'],
      PIXEL_TECHNIQUE: ['AI choice - scale appropriate', 'single pixel details', 'cluster shading', 'outline definition', 'pattern fills'],
      SHAPE_APPROACH: ['AI choice - character fit', 'geometric forms', 'organic curves', 'angular design', 'rounded friendly'],
      ARCHETYPE: ['AI choice - context appropriate', 'hero character', 'enemy sprite', 'NPC figure', 'item icon', 'creature design'],
      CLASSIC_TRAIT: ['AI choice - style enhanced', 'timeless appeal', 'nostalgic charm', 'arcade personality', 'retro cool'],
      PALETTE_HINTS: ['AI choice - system appropriate', 'NES palette', 'GB green scale', 'C64 vibrant', 'CGA limited', 'custom retro'],
      W: ['32'],
      H: ['32'],
      PALETTE_N: ['AI choice - constraint fit', '4', '6', '8', '12']
    },
    constraints: {
      transparentBG: true,
      targetSize: [32, 32],
      paletteColors: 8,
      avoid: ['anti-aliasing', 'gradients', 'tiny details']
    },
    version: 1,
    active: true
  },

  {
    id: 'tile-32',
    label: '32x32 Seamless Tile',
    type: 'tile',
    system: `TRANSFORMATION PROCESS: Transform input into a seamless tileable texture. Create patterns that feel natural when repeated while maintaining pixel art aesthetics.

STRICT OUTPUT REQUIREMENTS:
- Format: PNG, background can be opaque for tiles
- Canvas: EXACTLY {W}x{H} pixels
- Tiling: Must tile perfectly on all 4 edges with no visible seams
- Style: {STYLE} pixel art with consistent lighting
- Palette: Maximum {PALETTE_N} colors

Tiling Rules:
- Left edge must match right edge exactly
- Top edge must match bottom edge exactly
- Pattern should feel natural when repeated`,

    userTemplate: `TILING BRIEF: Transform input into seamless tile: "{USER_PROMPT}"

Technical Specs:
- Style: {STYLE}
- Pattern: {PATTERN_TYPE}
- Lighting: {LIGHTING}
- Texture: {TEXTURE_DETAIL}
- Colors: {PALETTE_HINTS}

Requirements:
- Size: {W}x{H} pixels exactly
- Must tile seamlessly
- Maximum {PALETTE_N} colors`,

    variables: {
      STYLE: ['AI choice - tile optimized', '16-bit detailed', '8-bit NES', 'Game Boy mono', 'SNES quality', 'PC-98 crisp', 'Amiga rich'],
      PATTERN_TYPE: ['AI choice - natural flow', 'organic natural', 'geometric precise', 'irregular hand-made', 'structured grid', 'flowing curves', 'angular shapes'],
      LIGHTING: ['AI choice - tile friendly', 'flat ambient', 'top-down lit', 'side lighting', 'no shadows', 'subtle depth', 'dramatic contrast'],
      TEXTURE_DETAIL: ['AI choice - repetition aware', 'smooth clean', 'rough weathered', 'highly detailed', 'minimalist', 'medium complexity', 'ornate decorative'],
      SURFACE_TYPE: ['AI choice - context match', 'stone masonry', 'wood grain', 'metal plating', 'fabric weave', 'natural ground', 'fantasy material'],
      PALETTE_HINTS: ['AI choice - material realistic', 'stone grays', 'forest greens', 'wood browns', 'metal blues', 'earth tones', 'crystal colors', 'lava reds', 'ice blues'],
      TILE_MOOD: ['AI choice - environment fit', 'ancient ruins', 'modern clean', 'fantasy realm', 'sci-fi tech', 'natural world', 'dungeon dark'],
      W: ['32'],
      H: ['32'],
      PALETTE_N: ['AI choice - complexity fit', '4', '6', '8', '12', '16']
    },
    constraints: {
      transparentBG: false,
      targetSize: [32, 32],
      paletteColors: 8,
      avoid: ['gradients', 'directional lighting']
    },
    version: 1
  },

  {
    id: 'background-256',
    label: '256x144 Game Background',
    type: 'background',
    system: `TRANSFORMATION PROCESS: Transform any input into a compelling pixel art background scene. Create atmospheric depth and mood suitable for video game environments.

Create a pixel art background scene from the provided input.

STRICT OUTPUT REQUIREMENTS:
- Format: PNG with NO transparency (full opaque background)
- Canvas: EXACTLY {W}x{H} pixels  
- Style: {STYLE} pixel art background
- Palette: Maximum {PALETTE_N} colors
- Depth: Clear foreground, midground, background separation

Composition Rules:
- Fill entire canvas, no transparency
- Create depth through color and detail variation
- Suitable for side-scrolling or static game scenes`,

    userTemplate: `SCENE BRIEF: Transform input into background scene: "{USER_PROMPT}"

Scene Setup:
- Style: {STYLE}
- Mood: {MOOD}
- Depth: {DEPTH_LAYERS}
- Lighting: {LIGHTING}
- Detail: {DETAIL_LEVEL}
- Colors: {PALETTE_HINTS}

Technical:
- Size: {W}x{H} pixels exactly
- No transparency (solid background)
- Maximum {PALETTE_N} colors`,

    variables: {
      STYLE: ['AI choice - scene optimized', '16-bit detailed', '8-bit simple', 'SNES quality', 'modern pixel', 'Neo Geo rich', 'PC Engine colorful'],
      MOOD: ['AI choice - context appropriate', 'bright cheerful', 'moody atmospheric', 'dramatic epic', 'serene peaceful', 'mysterious dark', 'energetic vibrant'],
      DEPTH_LAYERS: ['AI choice - depth optimized', '3-layer parallax', 'deep perspective', 'flat poster style', '5-layer depth', 'atmospheric perspective'],
      LIGHTING: ['AI choice - mood enhanced', 'golden hour', 'midday sun', 'sunset glow', 'night moon', 'storm clouds', 'indoor ambient', 'magical glow'],
      WEATHER: ['AI choice - scene appropriate', 'clear skies', 'cloudy', 'raining', 'snowing', 'misty fog', 'dust storm'],
      SCENE_TYPE: ['AI choice - environment fit', 'outdoor landscape', 'indoor interior', 'underground cave', 'sky realm', 'urban city', 'fantasy realm', 'sci-fi tech'],
      DETAIL_LEVEL: ['AI choice - resolution fit', 'highly detailed', 'medium complexity', 'clean simple', 'ornate decorative', 'weathered aged'],
      PALETTE_HINTS: ['AI choice - theme match', 'natural earthy', 'vibrant tropical', 'cool arctic', 'warm desert', 'deep ocean', 'autumn leaves', 'spring fresh', 'neon cyber'],
      COMPOSITION: ['AI choice - visual flow', 'rule of thirds', 'centered focus', 'leading lines', 'symmetrical', 'asymmetrical dynamic'],
      W: ['256'],
      H: ['144'],
      PALETTE_N: ['AI choice - detail appropriate', '12', '16', '24', '32', '48']
    },
    constraints: {
      transparentBG: false,
      targetSize: [256, 144],
      paletteColors: 24,
      avoid: ['transparency', 'UI elements']
    },
    version: 1
  },

  {
    id: 'sprite-16',
    label: '16x16 Micro Sprite',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Create ultra-condensed pixel art sprites from any input. At 16x16, every single pixel matters - focus on essential shapes and maximum clarity.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Character sprite only
- Style: {STYLE} with {ICON_APPROACH} clarity
- Palette: Maximum {PALETTE_N} colors
- Readability: Must work as UI icon or tiny sprite

SPRITE REQUIREMENTS:
- Clean micro artwork
- Centered tiny sprite

MICRO STANDARDS:
- Silhouette is everything at this scale
- Use {SIMPLIFICATION} approach for complex subjects
- Apply {CONTRAST_STRATEGY} for visibility
- Consider {USAGE_CONTEXT} requirements`,

    userTemplate: `MICRO BRIEF: Create 16x16 pixel sprite: "{USER_PROMPT}"

MICRO APPROACH:
- Style: {STYLE} with {RETRO_SYSTEM} constraints
- Clarity: {ICON_APPROACH} with {SIMPLIFICATION}
- Contrast: {CONTRAST_STRATEGY} for {USAGE_CONTEXT}
- Symbol: {SYMBOLIC_APPROACH} representation

SPECS: {W}x{H}px, max {PALETTE_N} colors, centered sprite`,

    variables: {
      STYLE: ['AI choice - micro optimized', '8-bit pure', 'Game Boy DMG', 'Atari minimalist', 'Icon style'],
      RETRO_SYSTEM: ['AI choice - authentic', 'NES limitations', 'Game Boy constraints', 'C64 palette', 'Atari simplicity'],
      ICON_APPROACH: ['AI choice - clarity first', 'bold iconic', 'minimal essential', 'symbolic simple', 'recognizable shape'],
      SIMPLIFICATION: ['AI choice - feature focus', 'core features only', 'geometric abstraction', 'key elements', 'essential details'],
      CONTRAST_STRATEGY: ['AI choice - visibility max', 'high contrast', 'outline heavy', 'color separation', 'shape definition'],
      USAGE_CONTEXT: ['AI choice - use optimized', 'UI icon', 'inventory item', 'map marker', 'status indicator', 'collectible'],
      SYMBOLIC_APPROACH: ['AI choice - meaning clear', 'literal representation', 'symbolic abstraction', 'iconic shape', 'universal symbol'],
      W: ['16'],
      H: ['16'],
      PALETTE_N: ['AI choice - constraint fit', '3', '4', '6', '8']
    },
    constraints: {
      transparentBG: true,
      targetSize: [16, 16],
      paletteColors: 4,
      avoid: ['fine details', 'gradients', 'complex shapes']
    },
    version: 1,
    active: true
  },

  {
    id: 'portrait-128',
    label: '128x128 Character Portrait',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Transform input into a detailed character portrait with personality and depth. Focus on facial features, expression, and character design at portrait scale.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Character sprite only
- Style: {STYLE} portrait art with {PORTRAIT_FOCUS}
- Palette: Maximum {PALETTE_N} colors with {COLOR_HARMONY}
- Composition: {FRAMING} framing with {EXPRESSION_DEPTH}

PORTRAIT REQUIREMENTS:
- Clean character portrait
- Centered facial artwork

PORTRAIT STANDARDS:
- Emphasize personality and character
- Use {LIGHTING_STYLE} to enhance mood
- Apply {DETAIL_APPROACH} for facial features
- Consider {PORTRAIT_STYLE} artistic approach`,

    userTemplate: `PORTRAIT BRIEF: Create character portrait: "{USER_PROMPT}"

CHARACTER DIRECTION:
- Style: {STYLE} with {PORTRAIT_STYLE} approach
- Personality: {PERSONALITY_TYPE} with {EXPRESSION_MOOD}
- Framing: {FRAMING} showing {PORTRAIT_FOCUS}
- Lighting: {LIGHTING_STYLE} with {ATMOSPHERE}
- Detail: {DETAIL_APPROACH} with {COLOR_HARMONY}

SPECS: {W}x{H}px, centered sprite, max {PALETTE_N} colors`,

    variables: {
      STYLE: ['AI choice - portrait fit', '16-bit detailed', 'SNES RPG style', 'Fighting game portrait', 'Visual novel art', 'Modern pixel portrait'],
      PORTRAIT_STYLE: ['AI choice - character match', 'realistic proportions', 'anime inspired', 'western comic', 'stylized cartoon', 'gothic detailed'],
      PERSONALITY_TYPE: ['AI choice - character fit', 'heroic noble', 'mysterious enigmatic', 'friendly approachable', 'wise elder', 'fierce warrior', 'cute innocent'],
      EXPRESSION_MOOD: ['AI choice - emotion match', 'confident smile', 'determined focus', 'gentle kindness', 'mysterious intrigue', 'fierce intensity', 'peaceful calm'],
      FRAMING: ['AI choice - composition best', 'close-up face', 'bust portrait', 'head and shoulders', 'three-quarter view'],
      PORTRAIT_FOCUS: ['AI choice - feature emphasis', 'facial expression', 'character design', 'costume details', 'personality traits'],
      LIGHTING_STYLE: ['AI choice - mood enhanced', 'soft portrait lighting', 'dramatic side light', 'rim lighting', 'ambient glow', 'high contrast'],
      ATMOSPHERE: ['AI choice - mood appropriate', 'warm inviting', 'cool mysterious', 'bright cheerful', 'dark brooding', 'magical ethereal'],
      DETAIL_APPROACH: ['AI choice - scale appropriate', 'high facial detail', 'stylized features', 'expressive eyes', 'costume focus', 'balanced detail'],
      COLOR_HARMONY: ['AI choice - theme match', 'warm portrait tones', 'cool character colors', 'vibrant personality', 'muted sophisticated', 'fantasy palette'],
      W: ['128'],
      H: ['128'],
      PALETTE_N: ['AI choice - detail support', '16', '24', '32', '48']
    },
    constraints: {
      transparentBG: true,
      targetSize: [128, 128],
      paletteColors: 24,
      avoid: ['generic faces', 'flat expression']
    },
    version: 1,
    active: true
  },

  {
    id: 'tile-16',
    label: '16x16 Pattern Tile',
    type: 'tile',
    system: `TRANSFORMATION PROCESS: Create seamless micro-patterns from any input. At 16x16, focus on simple, repeatable elements that create larger textures when tiled.

STRICT OUTPUT REQUIREMENTS:
- Format: PNG, background can be opaque
- Canvas: EXACTLY {W}x{H} pixels
- Tiling: Perfect seamless edges on all sides
- Style: {STYLE} with {PATTERN_DENSITY}
- Palette: Maximum {PALETTE_N} colors

MICRO-TILE STANDARDS:
- Simple patterns that scale beautifully
- Use {REPETITION_STYLE} repetition approach
- Apply {MICRO_DETAIL} detail level
- Consider {TILE_PURPOSE} usage context`,

    userTemplate: `MICRO-TILE BRIEF: Create 16x16 seamless pattern: "{USER_PROMPT}"

PATTERN APPROACH:
- Style: {STYLE} with {PATTERN_DENSITY}
- Repetition: {REPETITION_STYLE} using {MICRO_DETAIL}
- Purpose: {TILE_PURPOSE} with {VISUAL_WEIGHT}
- Colors: {PALETTE_HINTS} in {PALETTE_N} colors

SPECS: {W}x{H}px, seamless, simple pattern`,

    variables: {
      STYLE: ['AI choice - pattern fit', '8-bit classic', 'Game Boy simple', 'NES texture', '16-bit refined'],
      PATTERN_DENSITY: ['AI choice - scale appropriate', 'minimal sparse', 'moderate density', 'dense detailed', 'single element'],
      REPETITION_STYLE: ['AI choice - natural flow', 'regular grid', 'offset pattern', 'organic scatter', 'geometric precise'],
      MICRO_DETAIL: ['AI choice - readable scale', 'single pixel elements', '2x2 clusters', 'simple shapes', 'line patterns'],
      TILE_PURPOSE: ['AI choice - use optimized', 'floor texture', 'wall pattern', 'background fill', 'UI element', 'decoration'],
      VISUAL_WEIGHT: ['AI choice - context fit', 'subtle background', 'medium presence', 'bold statement', 'accent pattern'],
      PALETTE_HINTS: ['AI choice - material match', 'stone texture', 'wood grain', 'metal surface', 'fabric weave', 'natural ground'],
      W: ['16'],
      H: ['16'],
      PALETTE_N: ['AI choice - simplicity first', '3', '4', '6', '8']
    },
    constraints: {
      transparentBG: false,
      targetSize: [16, 16],
      paletteColors: 4,
      avoid: ['complex details', 'directional elements']
    },
    version: 1,
    active: true
  },

  {
    id: 'icon-24',
    label: '24x24 Game Icon',
    type: 'sprite',
    system: `TRANSFORMATION PROCESS: Create clear, functional game icons from any input. Perfect for UI, inventory, abilities - must be instantly recognizable and readable.

CRITICAL OUTPUT REQUIREMENTS:
- Format: PNG sprite
- Canvas: EXACTLY {W}x{H} pixels
- Content: Character sprite only
- Style: {STYLE} with {CLARITY_LEVEL} clarity
- Palette: Maximum {PALETTE_N} colors
- Function: Must work as {ICON_TYPE} in UI context

ICON REQUIREMENTS:
- Clean symbol artwork
- Centered icon design

ICON STANDARDS:
- Instant recognition at small size
- Use {SYMBOL_APPROACH} symbolic representation
- Apply {VISUAL_HIERARCHY} design principles
- Consider {UI_CONTEXT} usage requirements`,

    userTemplate: `ICON BRIEF: Create functional game icon: "{USER_PROMPT}"

ICON DESIGN:
- Type: {ICON_TYPE} with {SYMBOL_APPROACH}
- Clarity: {CLARITY_LEVEL} using {VISUAL_HIERARCHY}
- Context: {UI_CONTEXT} with {RECOGNITION_STYLE}
- Colors: {PALETTE_HINTS} max {PALETTE_N} colors

SPECS: {W}x{H}px, centered sprite, UI optimized`,

    variables: {
      STYLE: ['AI choice - UI optimized', '16-bit clean', 'Modern pixel icon', 'Retro game UI', 'Minimal design'],
      ICON_TYPE: ['AI choice - function match', 'inventory item', 'ability icon', 'status effect', 'menu button', 'collectible', 'tool/weapon'],
      SYMBOL_APPROACH: ['AI choice - recognition best', 'literal object', 'symbolic representation', 'abstract concept', 'metaphorical design'],
      CLARITY_LEVEL: ['AI choice - readability max', 'ultra clear', 'high contrast', 'bold simple', 'detailed precise'],
      VISUAL_HIERARCHY: ['AI choice - focus optimized', 'single focal point', 'layered importance', 'color coding', 'size emphasis'],
      UI_CONTEXT: ['AI choice - usage fit', 'inventory grid', 'action bar', 'menu system', 'HUD element', 'tooltip display'],
      RECOGNITION_STYLE: ['AI choice - memory aid', 'instantly recognizable', 'culturally familiar', 'game convention', 'unique distinctive'],
      PALETTE_HINTS: ['AI choice - function coded', 'item rarity colors', 'category coding', 'neutral universal', 'brand consistent'],
      W: ['24'],
      H: ['24'],
      PALETTE_N: ['AI choice - clarity first', '4', '6', '8', '12']
    },
    constraints: {
      transparentBG: true,
      targetSize: [24, 24],
      paletteColors: 8,
      avoid: ['fine text', 'complex scenes', 'unclear symbolism']
    },
    version: 1,
    active: true
  }
];
