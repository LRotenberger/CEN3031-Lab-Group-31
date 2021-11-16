import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
} from "react-native";
import CheckBox from "expo-checkbox";
import CheckmarkLabel from "./CheckmarkLabel";

const checkedItems = {
  plastic: false,
  paper: false,
  glass: false,
  metal: false,
  textiles: false,
  organics: false,
  // misc: false,
};

const initialState = { materials: [] };

export default function GeotagSubmit({ pictureData, onSubmit, lat, long }) {
  const [checked, setChecked] = useState({ ...checkedItems });
  const [geotag, editGeotag] = useState({ ...initialState, lat, long });

  const handleValueChange = (name, value) => {
    const material = checked[name];

    if (!material) {
      editGeotag((curr) => {
        let newmaterials = curr.materials;
        newmaterials.push(name);
        return {
          ...curr,
          materials: newmaterials,
        };
      });
    } else {
      editGeotag((curr) => {
        let newmaterials = curr.materials.filter((e) => e !== name);
        return {
          ...curr,
          materials: newmaterials,
        };
      });
    }

    setChecked((curr) => ({ ...curr, [name]: value }));
  };

  useEffect(() => {
    return () => {
      setChecked({ ...checkedItems });
      editGeotag({ materials: [], lat, long });
    };
  }, [pictureData]);

  return (
    <View style={pictureData ? styles.show : styles.hide}>
      <View style={styles.content}>
        <Image source={{ uri: pictureData?.uri }} style={styles.imagePreview} />
        <View style={styles.form}>
          <View style={styles.checkboxGroup}>
            <CheckBox
              style={styles.checkbox}
              value={checked.plastic}
              onValueChange={(value) => handleValueChange("plastic", value)}
            />
            <CheckmarkLabel> Plastic </CheckmarkLabel>
            <CheckBox
              style={styles.checkbox}
              value={checked.paper}
              onValueChange={(value) => handleValueChange("paper", value)}
            />
            {/* prettier-ignore */}
            <CheckmarkLabel> Paper    </CheckmarkLabel>
            <CheckBox
              style={styles.checkbox}
              value={checked.glass}
              onValueChange={(value) => handleValueChange("glass", value)}
            />
            <CheckmarkLabel> Glass </CheckmarkLabel>
          </View>
          <View style={styles.checkboxGroup}>
            <CheckBox
              style={styles.checkbox}
              value={checked.metal}
              onValueChange={(value) => handleValueChange("metal", value)}
            />
            {/* prettier-ignore */}
            <CheckmarkLabel> Metal {'  '}</CheckmarkLabel>
            <CheckBox
              style={styles.checkbox}
              value={checked.textiles}
              onValueChange={(value) => handleValueChange("textiles", value)}
            />
            <CheckmarkLabel> Textiles </CheckmarkLabel>
            <CheckBox
              style={styles.checkbox}
              value={checked.organics}
              onValueChange={(value) => handleValueChange("organics", value)}
            />
            <CheckmarkLabel> Organics</CheckmarkLabel>
          </View>
          {/* <CheckBox
            style={styles.checkbox}
            value={checked.misc}
            onValueChange={(value) => handleValueChange("misc", value)}
          /> */}
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={() => onSubmit(geotag)}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
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
  checkboxGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    left: 10,
    top: 20,
    marginBottom: 25,
  },
  checkbox: {
    width: 30,
    height: 30,
    margin: 8,
  },
  submitContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 20,
    marginBottom: 25,
  },
  submit: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 100,
    height: 40,
    backgroundColor: "lightgreen",
    borderRadius: 999,
    bottom: 10,
  },
});
