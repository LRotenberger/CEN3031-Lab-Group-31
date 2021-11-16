import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
} from "react-native";

export default function GeotagSubmit({ pictureData, onSubmit }) {
  return (
    <View style={pictureData ? styles.show : styles.hide}>
      <View style={styles.content}>
        <Image source={{ uri: pictureData.uri }} style={styles.imagePreview} />

        <View style={styles.form}>
          <Text>actions here</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  show: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    height:
      Platform.OS !== "ios" &&
      Dimensions.get("screen").height !== Dimensions.get("window").height &&
      StatusBar.currentHeight > 24
        ? Dimensions.get("window").height + StatusBar.currentHeight
        : Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    zIndex: 50,
  },
  hide: {
    display: "none",
  },
  content: {
    display: "flex",
    flex: 1,
  },
  imagePreview: {
    height: "75%",
    width: "100%",
  },
  form: {
    backgroundColor: "white",
    height: "25%",
  },
});
