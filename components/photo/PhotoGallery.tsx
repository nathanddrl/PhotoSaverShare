// components to displays all photos in the app
// Path: AppTab\components\photo\PhotoGallery.tsx

import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import CustomPhoto from "./CustomPhoto";
import * as Location from "expo-location";


const PhotoGallery: React.FC<{ photos: { uri: string, location: Location.LocationObject }[] }> = ({ photos }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
        <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            renderItem={({ item }) => (
            <TouchableOpacity
            >
                <CustomPhoto uri={item.uri} />
            </TouchableOpacity>
            )}
        />
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

export default PhotoGallery;