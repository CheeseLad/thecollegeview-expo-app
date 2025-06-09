import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SavedArticlesProvider } from '../context/SavedArticlesContext';

export default function RootLayout() {
  return (
    <SavedArticlesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />r
      </Stack>
      <StatusBar style="light" />
    </SavedArticlesProvider>
  );
}
