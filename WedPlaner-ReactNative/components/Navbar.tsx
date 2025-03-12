import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const pathname = usePathname();
  const isCalendarPage = pathname === '/(tabs)/calendar';

  const handleLogout = () => {
    signOut();
    router.replace('/login');
  };

  const handleBack = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={handleBack}>
        <Text style={styles.logo}>IDOYOUDO</Text>
      </TouchableOpacity>
      <View style={styles.navLinks}>
        {isCalendarPage ? (
          <TouchableOpacity onPress={handleBack} style={styles.navButton}>
            <FontAwesome name="arrow-left" size={25} color="#6d463e" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')} style={styles.navButton}>
            <FontAwesome name="calendar" size={25} color="#6d463e" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
          <FontAwesome name="sign-out" size={25} color="#6d463e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: 25,
    color: '#6d463e',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    marginTop: 50,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 50,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
