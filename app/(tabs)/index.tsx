import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useThemeColor } from "../../components/Themed";
import PhotoGallery from "../../components/photo/PhotoGallery";
import React from "react";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Location from "expo-location";

export default function TabOneScreen() {
  const accentColor = useThemeColor(
    { light: "#3F51B5", dark: "#3F51B5" },
    "accentColor"
    );
    
    const [photos, setPhotos] = React.useState<{ uri: string, location: Location.LocationObject }[]>([]);

  React.useEffect(() => {
    AsyncStorage.getItem("photos").then((photos) => {
      if (photos && photos.length !== 0) {
        try {
          const parsedPhotos = JSON.parse(photos);
          setPhotos(parsedPhotos);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }, []);

  //load photos from async storage
  const loadPhotos = () => {
    AsyncStorage.getItem("photos").then((photos) => {
      if (photos && photos.length !== 0) {
        try {
          const parsedPhotos = JSON.parse(photos);
          setPhotos(parsedPhotos);
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Photos</Text>
      <View style={[styles.separator, { backgroundColor: accentColor }]} />

      <PhotoGallery photos={photos} />

<View style={styles.buttonContainer} />
      <Button
        title="Load Photos"
        onPress={() => {
          loadPhotos();
        }}
      />
      <Button
        title="Clear Photos"
        onPress={() => {
          AsyncStorage.removeItem("photos");
          setPhotos([]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat-Bold",
    color: "#3F51B5",
    marginBottom: 20,
  },
  separator: {
    height: 2,
    width: "80%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  }
});