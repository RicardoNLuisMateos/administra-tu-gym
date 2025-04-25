import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        }
      }}
      >
      <Tabs.Screen name="settings" options={{ 
        title: 'Settings',
        tabBarIcon: ({ color,focused }) => <Ionicons name={ focused ? 'settings' : 'settings-outline'} size={24} color={color} />
      }} />
      <Tabs.Screen name="index" options={{ 
        title: 'Dashboard',
        tabBarIcon: ({ color,focused }) => <Ionicons name={ focused ? 'home' : 'home-outline'} size={24} color={color} />
      }} />
      <Tabs.Screen name="add-member" options={{ 
        title: 'Agregar Miembro',
        tabBarIcon: ({ color,focused }) => <Ionicons name={ focused ? 'person-add' : 'person-add-outline'} size={24} color={color} />,
        href: null // Esto ocultará la pestaña del tabBar
      }} />
      <Tabs.Screen name="about" options={{ 
        title: 'About',
        tabBarIcon: ({ color,focused }) => <Ionicons name={ focused ? 'information-circle' : 'information-circle-outline'} size={24} color={color} />
      }} />
    </Tabs>
  );
}
