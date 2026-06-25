import { API_BASE } from './apiClient';

export default function getImageUrl(imagePath) {
  const apiUrl = API_BASE;
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `${apiUrl}${imagePath}`;
  return `${apiUrl}/${imagePath}`;
}
