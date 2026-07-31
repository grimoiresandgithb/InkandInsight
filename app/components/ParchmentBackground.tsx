import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function ParchmentBackground({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ImageBackground
      source={require("../../assets/images/parchment.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(60, 45, 35, 0.35)",
          "rgba(60, 45, 35, 0.15)",
          "rgba(60, 45, 35, 0.0)",
        ]}
        style={styles.vignette}
      />
      <View style={styles.inner}>{children}, </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inner: {
    flex: 1,
  },
});
