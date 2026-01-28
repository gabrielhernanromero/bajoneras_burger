/**
 * Formatea un número a precio con separadores de miles
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

/**
 * Formatea un número de teléfono para WhatsApp
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Trunca un texto a una longitud específica
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Valida si una URL es válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Genera un ID único simple
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
