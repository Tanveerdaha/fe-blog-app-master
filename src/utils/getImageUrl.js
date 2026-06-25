export default function getImageUrl(imagePath) {
  const rawApiUrl = import.meta.env.VITE_API_URL || '';
  const apiUrl = rawApiUrl.replace(/\/$/, '');
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `${apiUrl}${imagePath}`;
  return `${apiUrl}/${imagePath}`;
}
