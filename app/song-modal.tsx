import { openTelegramLink } from "@telegram-apps/sdk";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  Music,
  getSongCouplets,
  isSongChordLine,
  isSongCoupletLine,
} from "@/api/songs";
import { useLayoutEffect, useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { buildTelegramShareLink, buildSongLink } from "@/utils/telegram";
import { COLORS } from "@/constants/theme";

type SongModalParams = {
  searchResultMusic: string;
};

export default function SongModal() {
  const params = useLocalSearchParams<SongModalParams>();
  const navigation = useNavigation();
  const searchResultMusic = useMemo(
    () => JSON.parse(params.searchResultMusic) as Music,
    [params.searchResultMusic]
  );
  console.log("route params", searchResultMusic);

  const [isCopyButtonHovered, setIsCopyButtonHovered] = useState(false);
  const [isShareButtonHovered, setIsShareButtonHovered] = useState(false);

  const lines = useMemo(() => searchResultMusic.text.split("\n"), []);

  const couplets = useMemo(
    () => getSongCouplets(searchResultMusic.text),
    []
  );

  const handleCopySong = async () => {
    const songUrl = buildSongLink(searchResultMusic.id);
    const songText = `${searchResultMusic.name} - ${
      searchResultMusic.lyric_author ||
      searchResultMusic.music_author ||
      searchResultMusic.artist.isp_name
    }\n\n${searchResultMusic.text}\n\n${songUrl}`;
    await navigator.clipboard.writeText(songText);
  };

  const handleShareSong = () => {
    const songUrl = buildSongLink(searchResultMusic.id);
    const shareText = `${searchResultMusic.name} - ${
      searchResultMusic.lyric_author ||
      searchResultMusic.music_author ||
      searchResultMusic.artist.isp_name
    }`;
    const shareUrl = buildTelegramShareLink(songUrl, shareText);

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: searchResultMusic.name });
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      contentContainerStyle={[{ padding: 16 }]}
    >
      {/* <View style={styles.container}> */}
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 24, fontWeight: 600 }}>
          {searchResultMusic.name}
        </Text>
        <Text style={{ fontSize: 18 }}>
          {searchResultMusic.artist.isp_name}
        </Text>
      </View>

      <View style={styles.shareButtonContainer}>
        <Pressable
          onPress={handleCopySong}
          onHoverIn={() => setIsCopyButtonHovered(true)}
          onHoverOut={() => setIsCopyButtonHovered(false)}
          style={({ pressed }) => [
            styles.shareButton,
            isCopyButtonHovered && {
              backgroundColor: COLORS.primary + "20",
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Feather name="copy" size={24} color="black" />
        </Pressable>
        <Pressable
          onPress={handleShareSong}
          onHoverIn={() => setIsShareButtonHovered(true)}
          onHoverOut={() => setIsShareButtonHovered(false)}
          style={({ pressed }) => [
            styles.shareButton,
            isShareButtonHovered && {
              backgroundColor: COLORS.primary + "20",
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Feather name="share-2" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.lyricsContainer}>
        {couplets.map((coupletLyrics, coupletIndex) => {
          const lines = coupletLyrics.split("\n");

          return (
            <View key={coupletIndex} style={styles.coupletContainer}>
              {lines.map((line, lineIndex) => {
                const isCoupletLine = isSongCoupletLine(
                  line,
                  lines[lineIndex - 1]
                );
                const isChordLine = isSongChordLine(line);

                return (
                  <Text
                    key={lineIndex}
                    style={[
                      styles.lyricsText,
                      ...(isChordLine && !isCoupletLine
                        ? [styles.lyricsChordText]
                        : []),
                    ]}
                  >
                    {line}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
// {
//   /* </View> */
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  shareButtonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 16,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  buttonPressed: {
    backgroundColor: COLORS.primary + "40",
  },
  lyricsContainer: {
    gap: 8,
  },
  coupletContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
  },
  lyricsText: {
    fontSize: 18,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    // Song lyrics are displayed correctly only in non-monospace font family
    // fontFamily: "sans-serif",
    // fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  lyricsChordText: {
    color: COLORS.primary,
    // Song lyrics are displayed correctly only in non-monospace font family
    // fontFamily: "sans-serif",
    // fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
});
