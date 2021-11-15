import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { Camera } from "expo-camera";

export default function CameraModal({ open, onPictureTaken }) {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    const data = await cameraRef.current?.takePictureAsync();

    if (data) {
      onPictureTaken(data);
    }
  };

  return (
    <View style={open ? styles.show : styles.hide}>
      <Camera style={styles.show} autoFocus="on" ref={cameraRef} />

      <TouchableOpacity
        style={styles.button}
        onPress={takePicture}
      ></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  show: {
    position: "absolute",
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
  button: {
    position: "absolute",
    bottom: 30,
    left: Dimensions.get("screen").width / 2 - 32,
    width: 64,
    height: 64,
    borderRadius: 999,
    zIndex: 50,
    backgroundColor: "white",
  },
});
