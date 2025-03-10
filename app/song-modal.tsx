import { openTelegramLink } from "@telegram-apps/sdk";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Music } from "@/api/songs";
import { useLayoutEffect, useMemo, useState } from "react";
import { Feather } from '@expo/vector-icons';
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

  const [isShareButtonHovered, setIsShareButtonHovered] = useState(false);

  const handleShareSong = () => {
    const songUrl = buildSongLink(searchResultMusic.id);
    const shareText = `${searchResultMusic.name} - ${searchResultMusic.artist.isp_name}`;
    const shareUrl = buildTelegramShareLink(songUrl, shareText);

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: searchResultMusic.name });
  }, []);

  return (
    <ScrollView contentContainerStyle={[{ padding: 16 }]}>
      {/* <View style={styles.container}> */}
      <View style={{ marginBottom: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: 600 }}>
          {searchResultMusic.name}
        </Text>
        <Text style={{ fontSize: 18 }}>
          {searchResultMusic.artist.isp_name}
        </Text>
      </View>

      <View style={styles.shareButtonContainer}>
        <Pressable
          onPress={handleShareSong}
          onHoverIn={() => setIsShareButtonHovered(true)}
          onHoverOut={() => setIsShareButtonHovered(false)}
          style={({ pressed }) => [
            styles.shareButton,
            isShareButtonHovered && { backgroundColor: COLORS.primary + '20' },
            pressed && styles.shareButtonPressed,
          ]}
        >
          <Feather name="share-2" size={24} color="black" />
        </Pressable>
      </View>

      <Text
        style={styles.lyricsText}
      >
        {searchResultMusic.text}
      </Text>
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
  shareButtonContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  shareButtonPressed: {
    backgroundColor: COLORS.primary + '40',
  },
  lyricsText: {
    fontSize: 18,
    fontWeight: '500',
    fontVariant: ["tabular-nums"],
    // Song lyrics are displayed correctly only in non-monospace font family
    // fontFamily: "sans-serif",
    // fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
});
