import { PostOpSpec } from '../types';

export type PostOp = { 
  id: string; 
  label: string; 
  apply: (bmp: ImageBitmap, params: any) => Promise<ImageBitmap>;
};

export const registry: Record<string, PostOp> = {
  trim: {
    id: 'trim',
    label: 'Trim transparent',
    async apply(bmp: ImageBitmap): Promise<ImageBitmap> {
      const canvas = new OffscreenCanvas(bmp.width, bmp.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bmp, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let left = canvas.width, right = 0, top = canvas.height, bottom = 0;
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
      }
      
      const width = Math.max(1, right - left + 1);
      const height = Math.max(1, bottom - top + 1);
      
      const trimmedCanvas = new OffscreenCanvas(width, height);
      const trimmedCtx = trimmedCanvas.getContext('2d')!;
      trimmedCtx.drawImage(canvas, left, top, width, height, 0, 0, width, height);
      
      return await createImageBitmap(trimmedCanvas.transferToImageBitmap());
    }
  },
  
  resize: {
    id: 'resize',
    label: 'Resize (nearest)',
    async apply(bmp: ImageBitmap, params: { scale: number } = { scale: 2 }): Promise<ImageBitmap> {
      const width = bmp.width * params.scale;
      const height = bmp.height * params.scale;
      
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d')!;
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bmp, 0, 0, width, height);
      
      return await createImageBitmap(canvas.transferToImageBitmap());
    }
  },
  
  chroma: {
    id: 'chroma',
    label: 'Chroma key',
    async apply(
      bmp: ImageBitmap, 
      params: { r: number; g: number; b: number; tolerance: number } = 
        { r: 255, g: 255, b: 255, tolerance: 18 }
    ): Promise<ImageBitmap> {
      const canvas = new OffscreenCanvas(bmp.width, bmp.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bmp, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - params.r;
        const dg = data[i + 1] - params.g;
        const db = data[i + 2] - params.b;
        
        if (Math.hypot(dr, dg, db) <= params.tolerance) {
          data[i + 3] = 0; // Make transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      return await createImageBitmap(canvas.transferToImageBitmap());
    }
  }
};

export async function runPipeline(srcBlob: Blob, ops: PostOpSpec[]): Promise<Blob> {
  let bmp = await createImageBitmap(srcBlob);
  
  for (const step of ops) {
    const operation = registry[step.id];
    if (operation) {
      bmp = await operation.apply(bmp, step.params);
    }
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bmp, 0, 0);
  
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob!), 'image/png');
  });
}