export const buildTelegramShareLink = (url: string, text?: string) => {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text ?? '')}`;
};