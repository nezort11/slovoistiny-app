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
import {
  searchSongs,
  Music,
  SearchResults,
  MusicLanguage,
  getHolychordsImageThumbnail,
  getSongFirstLine,
} from "@/api/songs";
import { COLORS } from "@/constants/theme";

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
    <SafeAreaView style={{ maxHeight: "100%" }}>
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
            testID="search-input"
            // data-testid="search-input"
            placeholder="Введите запрос для поиска"
            onChangeText={setSongSearchQuery}
            readOnly={isSearching}
            style={{ borderWidth: 1, minWidth: 200 }}
          />
          <Button
            testID="search-button"
            // data-testid="search-button"
            title="Поиск"
            onPress={handleSearch}
            disabled={!songSearchQuery || isSearching}
            color={COLORS.primary}
          />
        </View>
        <ScrollView>
          {isSearching && (
            <Text
              testID="loading-indicator"
              // data-testid="loading-indicator"
            >
              Загрузка...
            </Text>
          )}
          <View style={{ gap: 8 }}>
            {searchResults &&
              searchResults.musics.data
                .filter(
                  (searchResultMusic) =>
                    searchResultMusic.id_lang === MusicLanguage.Russian
                )
                .map((searchResultMusic) => {
                  const songFirstLine = getSongFirstLine(
                    searchResultMusic.text
                  )?.trim();
                  return (
                    <Pressable
                      testID="search-result"
                      // data-testid="search-result"
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
                        <Text style={{ fontWeight: 600 }}>
                          {searchResultMusic.name} (
                          {searchResultMusic.lyric_author ||
                            searchResultMusic.music_author ||
                            searchResultMusic.artist.isp_name}
                          )
                        </Text>
                        {songFirstLine && <Text>«{songFirstLine}»</Text>}
                        <Text></Text>
                      </View>
                    </Pressable>
                  );
                })}
          </View>
        </ScrollView>
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
