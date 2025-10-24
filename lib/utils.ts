import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidad para convertir bytes a URL de imagen
export const bytesToImageUrl = (bytes: any): string | null => {
  if (!bytes) return null;

  try {
    // Si ya es una string base64, retornar directamente
    if (typeof bytes === 'string' && bytes.startsWith('data:')) {
      return bytes;
    }

    // Si es un array de bytes, convertirlo a base64
    if (Array.isArray(bytes)) {
      const base64 = btoa(
        new Uint8Array(bytes).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:image/jpeg;base64,${base64}`;
    }

    // Si ya es base64 sin el prefijo, agregar el prefijo
    if (typeof bytes === 'string') {
      return `data:image/jpeg;base64,${bytes}`;
    }

    return null;
  } catch (error) {
    console.error("Error converting bytes to image URL:", error);
    return null;
  }
}
