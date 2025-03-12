import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, StatusBar } from 'react-native';

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated) {
      // Dacă nu este autentificat, redirecționează către login
      router.replace('/login');
    } else if (isAuthenticated && !inAuthGroup) {
      // Dacă este autentificat și nu este în grupul de tab-uri, redirecționează către index
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          backgroundColor: 'transparent',
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="login"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="dark-content"
      />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </View>
  );
}
