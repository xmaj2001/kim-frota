import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "@/assets/global.css";
import { useColorScheme } from "@/components/useColorScheme";
import { initDatabase } from "@/services/sqlite";
import { syncService } from "@/services/syncService";
import NetInfo from "@react-native-community/netinfo";

// Initialize DB immediately
initDatabase();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Initial sync
      syncService.syncData();

      // Listen for connection changes
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          syncService.syncData();
        }
      });

      return () => unsubscribe();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="modals/add-vehicle"
          options={{ presentation: "modal", headerTitle: "Novo Veículo" }}
        />
        <Stack.Screen
          name="modals/add-driver"
          options={{ presentation: "modal", headerTitle: "Novo Motorista" }}
        />
        <Stack.Screen
          name="modals/vehicle-details"
          options={{
            presentation: "modal",
            headerTitle: "Detalhes do Veículo",
          }}
        />
        <Stack.Screen
          name="modals/driver-details"
          options={{
            presentation: "modal",
            headerTitle: "Detalhes do Motorista",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
