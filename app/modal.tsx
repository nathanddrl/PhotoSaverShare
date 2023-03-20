import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useThemeColor } from '../components/Themed';
import TakePhoto from '../components/photo/TakePhotoComp';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <TakePhoto onPhotoTaken={(photo) => console.log(photo)} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
