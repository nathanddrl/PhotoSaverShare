import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as font from 'expo-font';
import ContextPhotos from '../components/ContextPhotos';
import React, { useState } from 'react';

//load all montserrat fonts
font.loadAsync({
  'Montserrat-Light': require('../fonts/Montserrat-Light.ttf'),
  'Montserrat-Regular': require('../fonts/Montserrat-Regular.ttf'),
  'Montserrat-Bold': require('../fonts/Montserrat-Bold.ttf'),
  'Montserrat-Italic': require('../fonts/Montserrat-Italic.ttf'),
  'Montserrat-SemiBold': require('../fonts/Montserrat-SemiBold.ttf'),
  'Montserrat-Medium': require('../fonts/Montserrat-Medium.ttf'),
  'Montserrat-Thin': require('../fonts/Montserrat-Thin.ttf'),
  'Montserrat-ExtraLight': require('../fonts/Montserrat-ExtraLight.ttf'),
  'Montserrat-ExtraBold': require('../fonts/Montserrat-ExtraBold.ttf'),
  'Montserrat-Black': require('../fonts/Montserrat-Black.ttf'),
  'Montserrat-LightItalic': require('../fonts/Montserrat-LightItalic.ttf'),
  'Montserrat-SemiBoldItalic': require('../fonts/Montserrat-SemiBoldItalic.ttf'),
  'Montserrat-MediumItalic': require('../fonts/Montserrat-MediumItalic.ttf'),
  'Montserrat-ThinItalic': require('../fonts/Montserrat-ThinItalic.ttf'),
  'Montserrat-ExtraLightItalic': require('../fonts/Montserrat-ExtraLightItalic.ttf'),
  'Montserrat-ExtraBoldItalic': require('../fonts/Montserrat-ExtraBoldItalic.ttf'),
  'Montserrat-BlackItalic': require('../fonts/Montserrat-BlackItalic.ttf'),
});


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const [photosUri, setPhotosContextArray] = useState({});
  const colorScheme = useColorScheme();

  return (
    <>
      <ContextPhotos.Provider value={{ photosUri, setPhotosContextArray }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
      </ContextPhotos.Provider>
    </>
  );
}
