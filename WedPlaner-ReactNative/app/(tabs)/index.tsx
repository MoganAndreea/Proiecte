import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable, Animated, ImageBackground, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../../components/Navbar';


// Adăugăm interfețele pentru tipuri
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AMRCountdownProps {
  targetDate: string;
}

const AMRCountdown: React.FC<AMRCountdownProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <View style={styles.amrContainer}>
      <Animated.View 
        style={[
          styles.heartContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.heartBase}>
          <View style={[styles.heartPiece, styles.leftPiece]} />
          <View style={[styles.heartPiece, styles.rightPiece]} />
        </View>
      </Animated.View>
      <Text style={styles.amrText}>
        AMR: {timeRemaining.days}d : {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
      </Text>
    </View>
  );
};

export default function Index() {
  const [selectedPlan, setSelectedPlan] = useState<string>('12+ Months Before');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const plans: Record<string, string[]> = {
 '12+ Months Before': [
                    'Insure your engagement ring',
                    'Make a guest list',
                    'Hire a wedding planner',
                    'Choose formality and theme',
                    'Select a venue and caterer',
                ],
                '10-12 Months Before': [
                    'Choose color palette and brainstorm design concepts',
                    'Hire priority vendors, like photographer, DJ/band, and videographer'
                ],
                '7-9 Months Before': [
                    'Shop for your wedding dress',
                    'Book hotel room blocks',
                    'Take engagement photos',
                    'Browse wedding invitations'
                ],
                '5-6 Months Before': [
                    'Buy your wedding dress',
                    'Send save-the-dates'
                ],
                '3-4 Months Before': [
                    'Register for gifts',
                    'Choose bridesmaids\' dresses and schedule fittings',
                    'Meet with potential florists'
                ],
                '2 Months Before': [
                    'Book the rehearsal dinner venue',
                    'Hire ceremony musicians',
                    'Order rentals',
                    'Hire officiant'
                ],
                '1 Month Before': [
                    'Hire a lighting technician'
                ],
                '2 Weeks Before': [
                    'Book all transportation',
                    'Book honeymoon',
                    'Buy or rent the groom’s tuxedo',
                    'Begin premarital counseling'
                ],
                'Final Week Before Wedding': [
                    'Have your final tasting with caterer',
                    'Choose your cake',
                    'Buy wedding bands',
                    'Have your hair and makeup trial'
                ],
                'Night Before & Wedding Day': [
                    'Order invitations',
                    'Brainstorm favors and gift bags',
                    'Book photo booth',
                    'Write your vows',
                    'Select ceremony readings',
                ]
  };

  const toggleTaskCompletion = (task: string): void => {
    setCompletedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  return (
    <ImageBackground 
      source={require('../../assets/Img_fundal.jpeg')} 
      style={styles.backgroundImage}
    >
      <Navbar />
      <LinearGradient
        colors={['#f8f4f4', '#e6d5d5']}
        style={styles.container}
      >
        <View style={styles.content}>
          <ScrollView 
            style={styles.leftPanel}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {Object.keys(plans).map((plan) => (
              <Pressable
                key={plan}
                onPress={() => setSelectedPlan(plan)}
                style={[
                  styles.planItem,
                  selectedPlan === plan && styles.selectedPlan
                ]}
              >
                <Text style={styles.planText}>{plan}</Text>
              </Pressable>
            ))}
            <AMRCountdown targetDate="2024-12-25T00:00:00" />
          </ScrollView>

          <View style={styles.rightPanel}>
            <Text style={styles.title}>{selectedPlan.toUpperCase()}</Text>
            <ScrollView 
              style={styles.taskList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.taskScrollContent}
            >
              {plans[selectedPlan]?.map((task, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.taskItem,
                    completedTasks.includes(task) && styles.completedTask
                  ]}
                  onPress={() => toggleTaskCompletion(task)}
                >
                  <Text style={styles.taskText}>{task}</Text>
                  <FontAwesome
                    name={completedTasks.includes(task) ? 'check-circle' : 'circle-o'}
                    size={24}
                    color="#5a3e36"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.socialMedia}>
              <View style={styles.socialIcons}>
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://www.facebook.com/your-page')}
                  style={styles.socialIcon}
                >
                  <FontAwesome name="facebook" size={36} color="#5a3e36" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://www.instagram.com/your-profile')}
                  style={styles.socialIcon}
                >
                  <FontAwesome name="instagram" size={36} color="#5a3e36" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://twitter.com/your-profile')}
                  style={styles.socialIcon}
                >
                  <FontAwesome name="twitter" size={36} color="#5a3e36" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingTop: 130,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: '30%',
    padding: 10,
  },
  rightPanel: {
    flex: 1,
    padding: 20,
  },
  planItem: {
    padding: 10,
    marginVertical: 5,
  },
  selectedPlan: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  planText: {
    fontSize: 16,
    color: '#5a3e36',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5a3e36',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 40,
    marginBottom: 10,
    width: 120,
  },
  completedTask: {
    backgroundColor: '#f8d7da',
  },
  taskText: {
    flex: 1,
    marginRight: 10,
    color: '#5a3e36',
  },
  socialMedia: {
    alignItems: 'center',
    marginTop: 30,
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 2,
  },
  amrContainer: {
    alignItems: 'center',
    marginTop: 50, //de aici modific mai sus sau mai jos 
    marginBottom: 20,
  },
  heartContainer: {
    marginBottom: 10,
  },
  heartBase: {
    width: 30,
    height: 30,
    position: 'relative',
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#FFB6C1',
  },
  heartPiece: {
    width: 30,
    height: 30,
    position: 'absolute',
    backgroundColor: '#FFB6C1',
    borderRadius: 15,
  },
  leftPiece: {
    left: -15,
    top: 0,
  },
  rightPiece: {
    left: 0,
    top: -15,
  },
  amrText: {
    fontSize: 16,
    color: '#5a3e36',
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  socialIcon: {
    padding: 5,
    marginHorizontal: 2,
  },
  scrollContent: {
    paddingRight: 10,
  },
  taskScrollContent: {
    paddingRight: 10,
  },
});
