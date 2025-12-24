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
const CONTACT_EMAIL = 'legal@seniorconnect.app';

export default function TermsScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: {LAST_UPDATED}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using the {COMPANY_NAME} mobile application ("App"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} is a companion app designed to help seniors stay connected with
            family and friends. Our services include:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Simplified video and voice calling</Text>
            <Text style={styles.bulletItem}>• Photo sharing with family circles</Text>
            <Text style={styles.bulletItem}>• Medication and appointment reminders</Text>
            <Text style={styles.bulletItem}>• Emergency contact quick dial</Text>
            <Text style={styles.bulletItem}>• Large, easy-to-read interface</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Health and Safety Disclaimer</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} provides reminder features for informational purposes only.
            Medication reminders are NOT a substitute for professional medical advice.
            Always follow your healthcare provider's instructions. In case of medical
            emergency, call emergency services immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Accounts</Text>
          <Text style={styles.paragraph}>
            To use certain features, you or your caregiver must create an account. You agree to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Provide accurate registration information</Text>
            <Text style={styles.bulletItem}>• Maintain the security of your credentials</Text>
            <Text style={styles.bulletItem}>• Notify us of any unauthorized access</Text>
            <Text style={styles.bulletItem}>• Only share access with trusted family members</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Family Circles</Text>
          <Text style={styles.paragraph}>
            You may invite family members and caregivers to your family circle. By inviting
            someone, you grant them access to view shared photos, send messages, and see
            your activity status. You can remove members at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Subscriptions</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} offers premium features through auto-renewable subscriptions.
            Payment is charged through your App Store or Google Play account. Subscriptions
            renew automatically unless cancelled 24 hours before the renewal date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Accessibility</Text>
          <Text style={styles.paragraph}>
            We are committed to making {COMPANY_NAME} accessible to all users. Our app
            features large text, high contrast options, and screen reader support. If you
            encounter accessibility issues, please contact us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Open Source Software</Text>
          <Text style={styles.paragraph}>
            This App uses open source software licensed under the MIT License, including
            React Native, Expo, Supabase, Zustand, and other libraries. Full license terms
            are available at{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://opensource.org/licenses/MIT')}>
              opensource.org/licenses/MIT
            </Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            Questions about these Terms? Contact us at:
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
