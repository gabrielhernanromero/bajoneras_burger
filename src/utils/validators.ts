/**
 * Valida que un email sea válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que un número de teléfono sea válido (formato argentino)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Valida que un campo no esté vacío
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida que un número sea positivo
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Valida que un archivo sea una imagen
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Valida el tamaño máximo de un archivo en MB
 */
export const isFileSizeValid = (file: File, maxSizeMB: number): boolean => {
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
};
