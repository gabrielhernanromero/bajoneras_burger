/**
 * Comprime una imagen para reducir su tamaño manteniendo calidad aceptable
 * @param file - Archivo de imagen a comprimir
 * @param maxSizeMB - Tamaño máximo en MB (default: 1MB)
 * @returns Promise con el archivo comprimido
 */
export const compressImage = (file: File, maxSizeMB: number = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionar si es muy grande (máximo 1920px de ancho)
        const maxWidth = 1920;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir con calidad reducida
        let quality = 0.8;
        
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir la imagen'));
                return;
              }
              
              const compressedSize = blob.size / (1024 * 1024);
              
              // Si aún es muy grande, reducir más la calidad
              if (compressedSize > maxSizeMB && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
    };
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
  });
};

/**
 * Convierte un archivo a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
