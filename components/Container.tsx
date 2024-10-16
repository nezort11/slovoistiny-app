import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";

export const Container = ({ children }: PropsWithChildren) => {
  return <ThemedView style={styles.content}>{children}</ThemedView>;
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
