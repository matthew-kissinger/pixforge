
export type PromptPreset = {
  id: string; 
  label: string;
  type: 'sprite'|'prop'|'tile'|'background';
  system: string;
  userTemplate: string;
  variables: Record<string, string[]>;
  constraints: {
    transparentBG?: boolean;
    targetSize?: [number, number];
    paletteColors?: number;
    avoid?: string[];
    camera?: string; 
    orientation?: string; 
    outline?: 'none'|'1px'|'2px';
    shading?: 'flat'|'cel'; 
    dithering?: 'none'|'bayer'|'floyd';
  };
  gen?: { temperature?: number; topP?: number; topK?: number };
  notes?: string; 
  version: number; 
  active?: boolean;
};

export type GenerationRequest = {
  input: Blob | string;
  presetId: string;
  vars: Record<string,string>;
};

export type GenerationResult = {
  id: string;
  raw: Blob;
  processed?: Blob;
  promptUsed: string;
  width: number; 
  height: number;
  model: string; 
  createdAt: string;
  pipeline?: PostOpSpec[];
};

export type PostOpSpec = { 
  id: string; 
  params: Record<string, any> 
};
