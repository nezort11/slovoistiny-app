import axios from "axios";
import { Platform } from "react-native";

type Artist = {
  id: number;
  isp_name: string; // artist name
  search_name: string;
  img_url: string; // artist avatar
};

export enum MusicLanguage {
  English = 1,
  Russian = 2,
  Ukrainian = 3,
}

export const getHolychordsImageThumbnail = (imageSrc: string) => {
  return `https://holychords.pro/thumb.php?src=${imageSrc}&t=m&w=40&h=40`;
};

export type Music = {
  id: number;
  name: string; // song title
  o_name: string; // song full title
  lyric_author: string; // Автор слов песни
  music_author: string; // Автор мелодии песни
  artist: Artist; // Исполнитель песни
  text: string; // song lyrics with accords
  tonal: string;
  id_lang: MusicLanguage;
  file: string; // song mp3 audio
  youtube: string; // song youtube video id
};

const isSongEmptyLine = (line: string) => line.trim().length === 0;

export const isSongCoupletLine = (
  line: string,
  previousLine: string | undefined
) =>
  line.trimEnd().at(-1) === ":" &&
  (previousLine ? isSongEmptyLine(previousLine) : true);

const CHORD_REGEX = /[A-Za-z0-9]/;

export const isSongChordLine = (line: string) => CHORD_REGEX.test(line);

export const getSongFirstLine = (lyrics?: string) => {
  const lines = lyrics?.split("\n");
  return lines?.find(
    (line, lineIndex) =>
      !isSongEmptyLine(line) &&
      !isSongCoupletLine(line, lines[lineIndex - 1]) &&
      !isSongChordLine(line)
  );
};

export const getSongCouplets = (lyrics?: string) => {
  const lines = lyrics?.split("\n");
  const couplets: string[] = [];
  let coupletIndex = 0;
  lines?.forEach((line, lineIndex) => {
    if (isSongCoupletLine(line, lines[lineIndex - 1])) {
      //   coupletLines.push(line);
      coupletIndex += 1;
      couplets[coupletIndex] = "";
    }

    couplets[coupletIndex] += "\n" + line;
  });
  return couplets;
};

export type MusicEntry = {
  name: string; // song title
  text: string; // song lyrics with accords
};

export type SearchResults = {
  musics: {
    data: Music[];
  };
  artists: Artist[];
};

const HTTP_PROXY_URL = process.env.EXPO_PUBLIC_HTTP_PROXY_URL;

const HOLYCHORDS_BASE_URL_CORS = "https://holychords.pro/";

const proxifyUrl = (url: string) => {
  const proxiedUrl = new URL(HTTP_PROXY_URL);
  proxiedUrl.pathname = url;
  return proxiedUrl.href;
};

// Proxy holychords requests in browser to bypass CORS
const HOLYCHORDS_BASE_URL =
  Platform.OS === "web"
    ? proxifyUrl(HOLYCHORDS_BASE_URL_CORS)
    : HOLYCHORDS_BASE_URL_CORS;

export const searchSongs = async (query: string) => {
  const songResultsResponse = await axios.get<SearchResults>("/search", {
    baseURL: HOLYCHORDS_BASE_URL,
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
    params: { name: query },
  });
  return songResultsResponse.data;
};

export const getSongEntry = async (songId: number) => {
  // try {
  const songEntryResponse = await axios.post<MusicEntry>(
    `/moderation/${songId}/entry`,
    null,
    {
      baseURL: HOLYCHORDS_BASE_URL,
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    }
  );
  return songEntryResponse.data;
  // } catch (error) {
  //   console.error("error getting song entry", error);
  //   throw error;
  // }
};
