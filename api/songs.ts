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
    text: string; // song lyrics with accords
    tonal: string;
    id_lang: MusicLanguage;
    artist: Artist;
    file: string; // song mp3 audio
    youtube: string; // song youtube video id
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
    const songResultsResponse = await axios.get<SearchResults>(
        '/search',
        {
            baseURL: HOLYCHORDS_BASE_URL,
            headers: {
                "x-requested-with": "XMLHttpRequest",
            },
            params: { name: query },
        }
    );
    return songResultsResponse.data;
};

export const getSongEntry = async (songId: number): Promise<Music> => {
  const songEntryResponse = await axios.get<Music>(`/moderation/${songId}/entry`, {
    baseURL: HOLYCHORDS_BASE_URL,
    headers: {
      "x-requested-with": "XMLHttpRequest"
    }
  });
  return songEntryResponse.data;
};