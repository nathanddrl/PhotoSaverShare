//component to take a photo
import React, { FC, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Camera, CameraType, AutoFocus, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import ContextPhotos from "../ContextPhotos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Animated } from "react-native";

const TakePhotoComp: FC<{ onPhotoTaken: (photo: string, location: Location.LocationObject) => void }> = ({
  onPhotoTaken,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [flashButtonCoolor, setFlashButtonCoolor] = useState<string>("white");
  const [type, setType] = useState<CameraType>(CameraType.front);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject>({
    coords: {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
    },
    timestamp: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [photos, setPhotos] = useState<{ uri: string, location: Location.LocationObject }[]>([]);
  const [flashOpacity] = useState(new Animated.Value(0));


  const toggleFlash = () => {
    setFlash(!flash);
    if (flashButtonCoolor === "white") {
      setFlashButtonCoolor("yellow");
    } else {
      setFlashButtonCoolor("white");
    }
  };

  const startFlashAnimation = () => {
    // Réinitialisez l'opacité à 1 (100% visible)
    flashOpacity.setValue(1);
  
    // Animer l'opacité jusqu'à 0 (complètement transparent) en 500 ms
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setErrorMsg(null);
      //load current photos from async storage and set them to state photos
      AsyncStorage.getItem("photos").then((photos) => {
        if (photos && photos.length !== 0) {
          try {
            const parsedPhotos = JSON.parse(photos);
            setPhotos(parsedPhotos);
          } catch (err) {
            console.log(err);
          }
        }
      }
      );
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      startFlashAnimation();
      const data = await cameraRef.current.takePictureAsync();
      const newPictures = [...photos];
      const picture = {
        uri: data.uri,
        location: location
      };
      newPictures.push(picture);
      setPhotos(newPictures);
      if (location) {
        onPhotoTaken(picture.uri, picture.location);
        console.log("location", location);
      }
      AsyncStorage.setItem("photos", JSON.stringify(newPictures));
      console.log(newPictures);
    }
  };
  

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.mainContainer}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        autoFocus={AutoFocus.on}
        flashMode={flash ? FlashMode.on : FlashMode.off}
        ratio={"4:3"}
      >
        <View style={styles.buttonContainer}></View>
      </Camera>
      <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "white",
          opacity: flashOpacity,
        },
      ]}
    />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            );
          }}
        >
          <Text style={styles.buttonText}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Ionicons name="camera" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            toggleFlash();
          }}
        >
          <Text style={styles.buttonText}>Flash</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const height = (width * 4) / 3;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    margin: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#FF4081",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  camera: {
    height: height,
    width: width,
  },
  photosContainer: {
    flex: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  photo: {
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 20,
  },
});

export default TakePhotoComp;
