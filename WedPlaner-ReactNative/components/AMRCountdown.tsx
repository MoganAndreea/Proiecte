import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
  targetDate: string;
};

export const AMRCountdown = ({ targetDate }: Props) => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const heartbeatAnim = new Animated.Value(1);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = new Date(targetDate).getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    const timer = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartbeatAnim }] }]}>
        <View style={styles.heart}>
          <View style={[styles.heartPiece, styles.heartLeft]} />
          <View style={[styles.heartPiece, styles.heartRight]} />
        </View>
      </Animated.View>
      <Text style={styles.text}>
        AMR: {timeRemaining.days}d : {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heartContainer: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    backgroundColor: '#ffc0cb',
    width: 30,
    height: 30,
    transform: [{ rotate: '45deg' }],
    position: 'relative',
  },
  heartPiece: {
    backgroundColor: '#ffc0cb',
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
  },
  heartLeft: {
    left: -15,
  },
  heartRight: {
    top: -15,
  },
  text: {
    fontSize: 16,
    color: '#5a3e36',
  },
}); 