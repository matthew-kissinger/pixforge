export async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bmp = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bmp, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function validateAlphaAndSize(
  blob: Blob, 
  targetWidth: number, 
  targetHeight: number, 
  expectAlpha: boolean
): Promise<boolean> {
  try {
    const imageData = await blobToImageData(blob);
    
    // Check size
    if (imageData.width !== targetWidth || imageData.height !== targetHeight) {
      return false;
    }
    
    if (!expectAlpha) return true;
    
    // Check border pixels for transparency (should be alpha=0)
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const stride = width * 4;
    
    // Check top border
    for (let x = 0; x < width; x++) {
      const alpha = data[x * 4 + 3];
      if (alpha !== 0) return false;
    }
    
    // Check bottom border
    for (let x = 0; x < width; x++) {
      const alpha = data[(height - 1) * stride + x * 4 + 3];
      if (alpha !== 0) return false;
    }
    
    // Check left border
    for (let y = 0; y < height; y++) {
      const alpha = data[y * stride + 3];
      if (alpha !== 0) return false;
    }
    
    // Check right border
    for (let y = 0; y < height; y++) {
      const alpha = data[y * stride + (width - 1) * 4 + 3];
      if (alpha !== 0) return false;
    }
    
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function base64ToBlob(base64: string): Promise<Blob> {
  const response = await fetch(base64);
  return response.blob();
}