export const buildTelegramShareLink = (url: string, text?: string) => {
  const shareUrl = new URL('https://t.me/share/url');
  shareUrl.searchParams.set('url', url);
  if (text) {
    shareUrl.searchParams.set('text', text);
  }
  return shareUrl.toString();
};