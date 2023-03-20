import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { abort } from "process";

export default function MapScreen() {
  const [photos, setPhotos] = useState<
    { uri: string; location: Location.LocationObject }[]
  >([]);
  const [region, setRegion] = useState<Location.LocationObject>({
    coords: {
      latitude: 43.610769,
      longitude: 3.876716,
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
    timestamp: 0,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setRegion(location);
      }

      const storedPhotos = await AsyncStorage.getItem("photos");
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    })();
  }, []);

  const shareImage = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Le partage d'image n'est pas disponible sur votre plateforme`);
      return;
    }

    Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: region.coords.latitude,
          longitude: region.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {photos.map((photo, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: photo.location.coords.latitude,
              longitude: photo.location.coords.longitude,
            }}
          >
            <Callout onPress={() => shareImage(photo.uri)}>
              <View style={styles.calloutContainer}>
                <Text
                  style={{
                    width: 100,
                    height: 100,
                    flex: 1,
                  }}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 100, height: 100 }}
                  />
                </Text>
                <MaterialIcons name="share" size={24} color="black" />
                <Text>Partager</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    minHeight: 300,
  },
  calloutContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLoad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
