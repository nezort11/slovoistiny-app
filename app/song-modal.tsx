import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Music } from "./(tabs)";
import { useLayoutEffect, useMemo } from "react";

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

  useLayoutEffect(() => {
    navigation.setOptions({ title: searchResultMusic.name });
  }, []);

  const fontFamily = Platform.OS === "ios" ? "Courier New" : "monospace";

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

      <Text
        style={{
          fontSize: 18,
          fontWeight: 500,
          fontVariant: ["tabular-nums"],
          fontFamily,
        }}
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
});
