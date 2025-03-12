import { Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export default function TabLayout() {
  const router = useRouter();

  const gesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.velocityX < -50) { // Swipe left to go to calendar
        router.replace('/calendar');
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Tabs
            screenOptions={{
              tabBarStyle: { display: 'none' },
              headerShown: false,
              ...(Platform.OS === 'android' && {
                android_statusBarTranslucent: true
              })
            }}
          >
            <Tabs.Screen 
              name="index" 
              options={{
                href: null
              }}
            />
            <Tabs.Screen 
              name="calendar"
              options={{
                href: null
              }}
            />
          </Tabs>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
