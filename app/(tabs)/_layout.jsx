import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0f4e99', tabBarStyle: { backgroundColor: 'black', borderColor: 'transparent' } }}>
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schema",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="availability"
        options={{
          title: "Tillgänglighet",
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />
        }}
      />
      <Tabs.Screen
      name="customers"
      options={{
        title: "Kunder",
        tabBarIcon: ({color, size}) => <Ionicons name="people-outline" size={size} color={color} />
      }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Mer",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }}
      />


    </Tabs>
  );
}