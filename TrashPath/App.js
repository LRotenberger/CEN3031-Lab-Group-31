import React, { useMemo } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import * as Location from "expo-location";
import { SearchBar } from "react-native-elements";
import * as Font from "expo-font";
import { Camera } from "expo-camera";
import CameraModal from "./components/CameraModal";
import GeotagSubmit from "./components/GeotagSubmit";
import WebView from "react-native-webview";

export default function App() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [search, setSearch] = useState();

  const [open, setOpen] = useState(false);
  const [pictureData, setPictureData] = useState(null);

  const [markerArray, setMarkerArray] = useState([]);
  const [markerCurr, setMarkerCurr] = useState([]);

  const onLocationChange = (newLocation) => {
    if (newLocation?.coords) {
      setLocation(newLocation);
      setRegion({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  const updateSearch = (newSearch) => {
    setSearch(newSearch);
  };

  useEffect(() => {
    let watcher;
    async function init() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      watcher = await Location.watchPositionAsync(
        { accuracy: 5, distanceInterval: 5 },
        onLocationChange
      );
      setAppIsReady(true);
    }

    init();

    // cleanup
    return () => watcher?.remove();
  }, []);

  useEffect(() => {
    async function cameraPerms() {
      let { status } = await Camera.requestPermissionsAsync();
      console.log(status);
      if (status !== "granted") {
        console.log("no perms");
        setErrorMsg("Permission to access camera was denied");
        return;
      }
    }
    cameraPerms();
  });

  const hasLocationData = useMemo(() => {
    if (location?.coords?.latitude && location?.coords?.longitude) {
      return true;
    }
    return false;
  }, [location]);

  const openCameraModal = () => {
    setOpen(true);
  };

  const handlePictureTaken = (data) => {
    // TODO

    setPictureData(data);

    setOpen(false);
  };

  const handleSubmitGeotag = async (data) => {
    console.log(data);
    data = {
      ...data,
      ["pictureData"]: `data:image/jpg;base64,${pictureData.base64}`,
    };
    setMarkerArray((markerArray) => [...markerArray, data]);
    // data is geotag object
    // TODO: send data and picture data to database

    // reset picture data to close GeotagSubmit view
    setPictureData(null);
  };

  const handleSearch = (e) => {
    setMarkerCurr(
      markerArray.filter((marker) =>
        marker.materials.includes(search.toLowerCase())
      )
    );
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          region={region}
          //onRegionChange={onRegionChange}
          style={styles.map}
        >
          {markerCurr.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.lat, longitude: marker.long }}
              description={marker.materials.toString()}
              style={{ zIndex: 1 }}
            >
              <Callout>
                <View>
                  <WebView
                    style={{ height: 120, width: 160 }}
                    source={{
                      uri: "https://acropolis-wp-content-uploads.s3.us-west-1.amazonaws.com/outside-dumpster-trash-garbage1.jpg",
                    }}
                    resizeMode="cover"
                  />
                  <Text>{marker.materials.toString()}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            style={{ zIndex: 0 }}
            image={require("./assets/currentlocation.png")}
          />
        </MapView>
      )}

      {hasLocationData && (
        <GeotagSubmit
          pictureData={pictureData}
          onSubmit={handleSubmitGeotag}
          lat={location.coords.latitude}
          long={location.coords.longitude}
        />
      )}

      <CameraModal open={open} onPictureTaken={handlePictureTaken} />

      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={openCameraModal}
          style={styles.locationButton}
        >
          <Image
            style={styles.imagestyle}
            source={require("./assets/addtag.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchbar}>
        <SearchBar
          placeholder="Type here..."
          onChangeText={updateSearch}
          value={search}
          onSubmitEditing={handleSearch}
          onClear={() => setMarkerCurr([])}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    position: "absolute",
    zIndex: 0,
    width: Dimensions.get("window").width,
    height:
      Platform.OS !== "ios" &&
      Dimensions.get("screen").height !== Dimensions.get("window").height &&
      StatusBar.currentHeight > 24
        ? Dimensions.get("window").height + StatusBar.currentHeight
        : Dimensions.get("window").height,
  },
  locationButton: {
    // position: "absolute",
    // right: 20,
    // bottom: 30,
    backgroundColor: "white",
    borderRadius: 999,
    zIndex: 10,
  },
  imageStyle: {
    width: 30,
    height: 30,
    // resizeMode: 'contain'
  },
  searchbar: {
    position: "absolute",
    top: StatusBar.currentHeight,
    width: Dimensions.get("screen").width,
  },
  cameraHidden: {
    display: "none",
  },
  cameraShown: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  toolbar: {
    position: "absolute",
    right: 20,
    bottom: 30,
  },
  markerImage: {
    resizeMode: "cover",
    height: 100,
    width: 100,
  },
});
