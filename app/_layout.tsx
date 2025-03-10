import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  isTMA,
  mockTelegramEnv,
  retrieveLaunchParams,
} from "@telegram-apps/bridge";
import {
  init,
  backButton,
} from "@telegram-apps/sdk-react";
import { openTelegramLink, requestWriteAccess } from "@telegram-apps/sdk";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { searchSongs, Music, getSongEntry } from "@/api/songs";
import { START_APP_PARAM_DELIMITER } from "@/utils/telegram";

import { useColorScheme } from "@/hooks/useColorScheme";

const initialize = async () => {
  // mockTelegramEnv({
  //   // launchParams: {
  //   //   tgWebAppThemeParams: {

  //   //   },

  //   // }
  //   themeParams: {
  //     accentTextColor: "#6ab2f2",
  //     bgColor: "#17212b",
  //     buttonColor: "#5288c1",
  //     buttonTextColor: "#ffffff",
  //     destructiveTextColor: "#ec3942",
  //     headerBgColor: "#17212b",
  //     hintColor: "#708499",
  //     linkColor: "#6ab3f3",
  //     secondaryBgColor: "#232e3c",
  //     sectionBgColor: "#17212b",
  //     sectionHeaderTextColor: "#6ab3f3",
  //     subtitleTextColor: "#708499",
  //     textColor: "#f5f5f5",
  //   },
  //   initData: {
  //     user: {
  //       id: 776696185,
  //       firstName: "Andrew",
  //       lastName: "Rogue",
  //       username: "rogue",
  //       languageCode: "en",
  //       isPremium: true,
  //       // allowsWriteToPm: true,
  //       allowsWriteToPm: true,
  //     },
  //     hash: "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31",
  //     authDate: new Date(1716922846000),
  //     signature: "abc",
  //     startParam: "debug",
  //     chatType: "sender",
  //     chatInstance: "8428209589180549439",
  //   },
  //   initDataRaw: new URLSearchParams([
  //     [
  //       "user",
  //       JSON.stringify({
  //         id: 776696185,
  //         first_name: "Andrew",
  //         last_name: "Rogue",
  //         username: "rogue",
  //         language_code: "en",
  //         is_premium: true,
  //         // allows_write_to_pm: true,
  //         allows_write_to_pm: true,
  //       }),
  //     ],
  //     [
  //       "hash",
  //       "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31",
  //     ],
  //     ["auth_date", "1716922846"],
  //     ["start_param", "debug"],
  //     ["signature", "abc"],
  //     ["chat_type", "sender"],
  //     ["chat_instance", "8428209589180549439"],
  //   ]).toString(),
  //   version: "7.2",
  //   platform: "tdesktop",
  // });

  // Dynamically add eruda
  // if (process.env.NODE_ENV === "development") {
  await import("../utils/eruda");
  // }

  const isTma = isTMA();
  console.log("isTma", isTma);
  if (isTma) {
    console.log("calling react sdk init");
    init();

    const launchParams = retrieveLaunchParams();
    console.log("launch params", launchParams);

    backButton.mount();

    // const user = launchParams.initData?.user;
    // if (user) {
    //   setUser({
    //     id: user.id, // user or chat id
    //     username: user.username,
    //     geo: {
    //       country_code: user.languageCode,
    //     },
    //   });
    // }

    // const launchParamsData = launchParams as unknown as Serializable;
    // setContext(
    //   "launch_params",
    //   launchParamsData as Record<string, unknown>
    // );
  }
};

initialize();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  // const launchParams = useLau();
  // const startParam = useSignal(initDataStartParam);
  // console.log("startParam", startParam);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleStartParam = async () => {
    await initialize();
    if (!isTMA()) {
      return;
    }

    console.log("retrieving launch params...");
    const launchParams = retrieveLaunchParams();
    const startParam = launchParams?.tgWebAppStartParam;
    console.log("startParam", startParam);
    if (!startParam) {
      return;
    }

    if (startParam.startsWith("song")) {
      const songId = parseInt(startParam.split(START_APP_PARAM_DELIMITER)[1]);
      console.log("songId", songId);
      const songEntry = await getSongEntry(songId);
      console.log("songEntry", songEntry);

      // Search for the song by name to get full details
      const searchResults = await searchSongs(songEntry.name);
      const song = searchResults.musics.data.find((m: Music) => m.id === songEntry.id);
      if (song) {
        router.push({
          pathname: "/song-modal",
          params: {
            searchResultMusic: JSON.stringify(song)
          }
        });
      } else {
        // Show alert if song not found
        Alert.alert(
          "Song Not Found",
          "Sorry, we couldn't find the requested song.",
          [{ text: "OK" }]
        );
      }
    } else {
      console.warn("dont know how to handle this start param");
    }
  };

  useEffect(() => {
    handleStartParam();
  }, []);


  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="song-modal"
          options={{
            presentation: "modal",
            // title: "asdf",
            // headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
