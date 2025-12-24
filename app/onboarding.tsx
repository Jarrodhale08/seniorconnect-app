/**
 * Onboarding Screen - SeniorConnect
 *
 * Shows new users the app's key features and presents the 7-day free trial.
 * Large, accessible design optimized for senior users.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  isPremium: boolean;
  color: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: 'Stay Connected with Family',
    description: 'Create family circles and share moments with loved ones. Video calls, photos, and messages all in one place.',
    icon: 'people',
    isPremium: false,
    color: '#EC4899',
  },
  {
    title: 'Never Miss Medications',
    description: 'Set up easy medication reminders with large, clear notifications. Keep track of your health routines effortlessly.',
    icon: 'medical',
    isPremium: true,
    color: '#8B5CF6',
  },
  {
    title: 'Emergency Contacts Ready',
    description: 'Quick access to emergency contacts and medical information. Peace of mind for you and your family.',
    icon: 'call',
    isPremium: false,
    color: '#EF4444',
  },
  {
    title: 'Track Your Health',
    description: 'Monitor vitals, appointments, and wellness goals. Share updates with family members and caregivers.',
    icon: 'fitness',
    isPremium: true,
    color: '#10B981',
  },
  {
    title: 'Try Premium Free for 7 Days',
    description: 'Get unlimited family circles, advanced medication reminders, video calls, and health tracking. No credit card needed to start!',
    icon: 'star',
    isPremium: true,
    color: '#F59E0B',
  },
];

const ONBOARDING_KEY = 'seniorconnect_onboarding_complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentSlide + 1),
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const handleStartTrial = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/subscription');
  };

  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
              <Ionicons name={slide.icon} size={80} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {slide.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={styles.premiumText}>Premium Feature</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {isLastSlide ? (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartTrial}
            >
              <Text style={styles.primaryButtonText}>Start Free Trial</Text>
              <Ionicons name="arrow-forward" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Continue Free</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
  },
  description: {
    fontSize: 20,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 16,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  premiumText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#EC4899',
    width: 32,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#EC4899',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
});
