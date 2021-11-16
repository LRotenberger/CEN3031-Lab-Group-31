import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CheckmarkLabel({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
  },
});
