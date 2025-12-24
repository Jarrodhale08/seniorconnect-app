import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LAST_UPDATED = 'December 24, 2024';
const COMPANY_NAME = 'SeniorConnect';
const CONTACT_EMAIL = 'privacy@seniorconnect.app';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/settings')}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: {LAST_UPDATED}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} ("we", "our", or "us") is committed to protecting your privacy
            and the privacy of your family. This Privacy Policy explains how we collect,
            use, and safeguard your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.subTitle}>Account Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Email address</Text>
            <Text style={styles.bulletItem}>• Name and profile picture</Text>
            <Text style={styles.bulletItem}>• Phone number (for emergency contacts)</Text>
          </View>

          <Text style={styles.subTitle}>Family Circle Data</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Family member connections</Text>
            <Text style={styles.bulletItem}>• Shared photos and messages</Text>
            <Text style={styles.bulletItem}>• Activity status (online/offline)</Text>
          </View>

          <Text style={styles.subTitle}>Health Reminders</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Medication reminder schedules</Text>
            <Text style={styles.bulletItem}>• Appointment reminders</Text>
            <Text style={styles.bulletItem}>• Daily activity reminders</Text>
          </View>

          <Text style={styles.subTitle}>Usage Data</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Device type and operating system</Text>
            <Text style={styles.bulletItem}>• App usage patterns</Text>
            <Text style={styles.bulletItem}>• Crash reports</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Enable communication with family members</Text>
            <Text style={styles.bulletItem}>• Send medication and appointment reminders</Text>
            <Text style={styles.bulletItem}>• Provide emergency contact quick dial</Text>
            <Text style={styles.bulletItem}>• Sync your data across devices</Text>
            <Text style={styles.bulletItem}>• Improve app accessibility and usability</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Sharing</Text>
          <Text style={styles.paragraph}>
            When you add family members to your circle, they can see your shared photos,
            messages, and online status. Family members with caregiver access may also
            view your reminder schedules. You control who has access to your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information Protection</Text>
          <Text style={styles.paragraph}>
            Medication and health reminders are stored securely and are only visible to
            you and designated caregivers. We never share health-related information with
            third parties for advertising purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage and Security</Text>
          <Text style={styles.paragraph}>
            Your data is stored securely using Supabase with Row Level Security (RLS) policies.
            We use industry-standard encryption to protect your information in transit and at rest.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Supabase - Database and authentication</Text>
            <Text style={styles.bulletItem}>• RevenueCat - Subscription management</Text>
            <Text style={styles.bulletItem}>• Expo - Push notifications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access your personal data</Text>
            <Text style={styles.bulletItem}>• Export your photos and data</Text>
            <Text style={styles.bulletItem}>• Delete your account and all data</Text>
            <Text style={styles.bulletItem}>• Remove family members from your circle</Text>
            <Text style={styles.bulletItem}>• Opt-out of non-essential notifications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            Questions about this Privacy Policy? Contact us at:
          </Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.link}>{CONTACT_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#9D174D',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BE185D',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#831843',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#831843',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 15,
    color: '#831843',
    lineHeight: 24,
    marginBottom: 4,
  },
  link: {
    fontSize: 15,
    color: '#EC4899',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
