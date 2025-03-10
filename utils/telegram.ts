// "/" and ":" are not allowed in telegram startapp params
// https://docs.telegram-mini-apps.com/platform/start-parameter#restrictions
export const START_APP_PARAM_DELIMITER = '_';

// https://core.telegram.org/bots/webapps#direct-link-mini-apps
export const buildSongLink = (songId: number) => {
  return `https://t.me/slovoistiny_bot/app?startapp=song${START_APP_PARAM_DELIMITER}${songId}`;
};

// https://stackoverflow.com/questions/78159682/how-to-implement-click-to-share-in-telegram-mini-app
export const buildTelegramShareLink = (url: string, text?: string) => {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text ?? '')}`;
};