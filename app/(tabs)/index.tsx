import {
  Image,
  StyleSheet,
  Platform,
  Button,
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import axios from "axios";
import { useIsAwaiting } from "@/hooks/useIsAwaiting";
import { Link, useNavigation, useRouter } from "expo-router";
import { Container } from "@/components/Container";

type Artist = {
  id: number;
  isp_name: string; // artist name
  search_name: string;
  img_url: string; // artist avatar
};

const getHolychordsImageThumbnail = (imageSrc: string) => {
  return `https://holychords.pro/thumb.php?src=${imageSrc}&t=m&w=40&h=40`;
};

enum MusicLanguage {
  English = 1,
  Russian = 2,
  Ukrainian = 3,
}

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

type SearchResults = {
  musics: {
    data: Music[];
  };
  artists: Artist[];
};

const HTTP_PROXY_URL = process.env.EXPO_PUBLIC_HTTP_PROXY_URL;

const HOLYCHORDS_API_URL_CORS = "https://holychords.pro/search";

const proxifyUrl = (url: string) => {
  const proxiedUrl = new URL(HTTP_PROXY_URL);
  proxiedUrl.pathname = url;
  return proxiedUrl.href;
};

// Proxy holychords requests in browser to bypass CORS
const HOLYCHORDS_API_URL =
  Platform.OS === "web"
    ? proxifyUrl(HOLYCHORDS_API_URL_CORS)
    : HOLYCHORDS_API_URL_CORS;

const searchSongs = async (query: string) => {
  const searchResults = await axios.get<SearchResults>(
    HOLYCHORDS_API_URL,
    {
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
      params: { name: query },
    }
  );
  return searchResults.data;
};

export default function HomeScreen() {
  // const navigation = useNavigation();
  const router = useRouter();
  const [songSearchQuery, setSongSearchQuery] = useState<
    string | undefined
  >();
  const [searchResults, setSearchResults] = useState<
    SearchResults | undefined
  >();

  const { wait: awaitSearchSongs, isAwaiting: isSearching } =
    useIsAwaiting(searchSongs);

  const handleSearch = async () => {
    setSearchResults(undefined);
    const searchResults_ = await awaitSearchSongs(songSearchQuery!);
    setSearchResults(searchResults_);
    console.log("SEARCH RESULTS", searchResults_);
  };

  return (
    <SafeAreaView>
      <Image
        source={require("@/assets/images/slovoistiny-logo.jpg")}
        style={styles.slovoistinyLogo}
      />

      <Container
      // headerBackgroundColor={{ light: "#101010", dark: "#101010" }}
      // headerImage={}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontSize: 28 }}>
            Слово Истины Песни
          </ThemedText>
          {/* <HelloWave /> */}
        </ThemedView>
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <TextInput
            placeholder="Введите запрос для поиска"
            onChangeText={setSongSearchQuery}
            readOnly={isSearching}
            style={{ borderWidth: 1, minWidth: 200 }}
          />
          <Button
            title="Поиск"
            onPress={handleSearch}
            disabled={!songSearchQuery || isSearching}
            color="#DFCE5A"
          />
        </View>
        <ScrollView>
          {isSearching && <Text>Загрузка...</Text>}
          <View style={{ gap: 8 }}>
            {searchResults &&
              searchResults.musics.data
                .filter(
                  (searchResultMusic) =>
                    searchResultMusic.id_lang === MusicLanguage.Russian
                )
                .map((searchResultMusic) => (
                  <Pressable
                    key={searchResultMusic.id}
                    onPress={() =>
                      router.push({
                        pathname: "/song-modal",
                        params: {
                          searchResultMusic:
                            JSON.stringify(searchResultMusic),
                        },
                      })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Image
                      width={40}
                      height={40}
                      source={{
                        uri: searchResultMusic.artist.img_url
                          ? getHolychordsImageThumbnail(
                              searchResultMusic.artist.img_url
                            )
                          : "https://holychords.pro/assets/img/no-cover.jpeg",
                      }}
                      style={{ borderRadius: 8, width: 40, height: 40 }}
                    />
                    <View
                      style={
                        {
                          // display: "flex",
                          // flexDirection: "column",
                          // flexWrap: "wrap",
                          // flex: 1,
                        }
                      }
                    >
                      <Text>{searchResultMusic.name}</Text>
                      <Text>{searchResultMusic.artist.isp_name}</Text>
                    </View>
                  </Pressable>
                ))}
          </View>
        </ScrollView>
        {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">
            app/(tabs)/index.tsx
          </ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">
            npm run reset-project
          </ThemedText>{" "}
          to get a fresh{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory.
          This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  slovoistinyLogo: {
    width: "100%",
    height: 320,
    // bottom: 0,
    // left: 0,
    // position: "absolute",
  },
});
