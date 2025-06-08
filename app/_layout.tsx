import { Stack } from 'expo-router';
import { SavedArticlesProvider } from '../context/SavedArticlesContext';

export default function RootLayout() {
  return (
    <SavedArticlesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SavedArticlesProvider>
  );
}
