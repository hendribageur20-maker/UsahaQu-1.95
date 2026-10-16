/**
 * HTML5 Canvas Auto Image Compressor for UsahaQu / BengkelQu
 * Compresses camera/upload photos (max-width: 300px, JPEG quality 0.7)
 * Keeps IndexedDB and LocalStorage extremely lightweight, avoiding APK memory bloat.
 */

export interface CompressionResult {
  base64: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  savedPercent: number;
  width: number;
  height: number;
}

/**
 * Compresses a File, Blob, or base64 image data URL using HTML5 Canvas.
 * Max width default: 300px, JPEG quality: 0.7
 */
export async function compressImage(
  source: File | Blob | string,
  maxWidth = 300,
  quality = 0.7
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // 1. Resolve source to an image element
    const img = new Image();
    let originalSizeBytes = 0;

    const setupImageAndProcess = (srcUrl: string) => {
      img.onload = () => {
        try {
          // Calculate target dimensions maintaining aspect ratio
          let targetWidth = img.naturalWidth || img.width;
          let targetHeight = img.naturalHeight || img.height;

          if (targetWidth > maxWidth) {
            const ratio = maxWidth / targetWidth;
            targetWidth = maxWidth;
            targetHeight = Math.round(targetHeight * ratio);
          }

          // Use HTML5 Canvas for offscreen rendering
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('HTML5 Canvas context not available'));
            return;
          }

          // Fill clean background and draw image
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Export compressed JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

          // Calculate approximate byte size from base64
          const base64ContentLength = compressedBase64.length - (compressedBase64.indexOf(',') + 1);
          const compressedSizeBytes = Math.round((base64ContentLength * 3) / 4);

          const origKb = Math.max(1, Math.round(originalSizeBytes / 1024));
          const compKb = Math.max(1, Math.round(compressedSizeBytes / 1024));
          const savedPercent = origKb > compKb ? Math.round(((origKb - compKb) / origKb) * 100) : 0;

          resolve({
            base64: compressedBase64,
            originalSizeKb: origKb,
            compressedSizeKb: compKb,
            savedPercent,
            width: targetWidth,
            height: targetHeight
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => reject(err);
      img.src = srcUrl;
    };

    if (typeof source === 'string') {
      originalSizeBytes = Math.round((source.length * 3) / 4);
      setupImageAndProcess(source);
    } else {
      originalSizeBytes = source.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setupImageAndProcess(e.target.result as string);
        } else {
          reject(new Error('Gagal membaca file foto'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(source);
    }
  });
}
