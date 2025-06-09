import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function TabLayout() {
  // Common size values
  const iconSize = 28;
  const textSize = 14;
  const tabBarHeight = 70;

  // Helper to render custom tab icon + label, like "Articles"
  const renderTabIcon = (focused: boolean, color: string, iconName: string, label: string) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons
        name={focused ? iconName : iconName + '-outline'}
        size={iconSize}
        color={color}
        style={{ marginTop: 15 }}
      />
      <Text
        style={{
          color,
          fontSize: textSize,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
          height: tabBarHeight,
          paddingBottom: 10,
        },
        tabBarLabel: () => null, // Hide default labels everywhere, we render custom labels
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(focused, color, 'newspaper', 'Articles'),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(focused, color, 'image', 'Categories'),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(focused, color, 'search', 'Search'),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(focused, color, 'bookmark', 'Saved'),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(focused, color, 'information-circle', 'About'),
        }}
      />
    </Tabs>
  );
}
