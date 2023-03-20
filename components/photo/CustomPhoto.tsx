//component that displays a photo
// Path: AppTab\components\photo\CustomPhoto.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Sharing from 'expo-sharing';
import { Alert } from "react-native";


const CustomPhoto: React.FC<{ uri: string }> = ({ uri }) => {

    const sharePhoto = async (uri: string) => {
        try {
          if (!(await Sharing.isAvailableAsync())) {
            alert("Le partage n'est pas disponible sur cette plateforme");
            return;
          }
          await Sharing.shareAsync(uri);
        } catch (error) {
          console.log('Erreur lors du partage :', error);
        }
      };

    return (
        <View style={styles.container}>
            <TouchableOpacity
            //on press, share the photo
                onPress={() => {
                    console.log("share photo");
                    sharePhoto(uri);
                }}
            >

            <Image style={styles.image} source={{ uri: uri }} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    },
});

export default CustomPhoto;
