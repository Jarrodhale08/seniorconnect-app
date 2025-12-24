/**
 * Home Screen - SeniorConnect
 *
 * Main dashboard showing family connections, activity, and quick actions.
 * Large, accessible design optimized for senior users.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { FREE_TIER_LIMITS, getRemainingFamilyCircles } from '../../src/config/premiumFeatures';

export default function HomeScreen() {
  const router = useRouter();
  const { isPremium } = useSubscriptionStore();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual stores when implemented
  const familyMembers = 5;
  const activeReminders = 3;
  const unreadMessages = 2;
  const currentFamilyCircles = 1;

  // Premium limits
  const circlesLimitReached = !isPremium && currentFamilyCircles >= FREE_TIER_LIMITS.maxFamilyCircles;
  const remainingCircles = getRemainingFamilyCircles(currentFamilyCircles, isPremium);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleAddCircle = useCallback(() => {
    if (circlesLimitReached) {
      router.push('/subscription');
    } else {
      // Navigate to create family circle screen
      // router.push('/create-circle');
    }
  }, [circlesLimitReached, router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#EC4899']}
            tintColor="#EC4899"
          />
        }
      >
        {/* Premium Banner for Free Users */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => router.push('/subscription')}
          >
            <Ionicons name="star" size={32} color="#F59E0B" />
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                {remainingCircles > 0
                  ? `${remainingCircles} free family ${remainingCircles === 1 ? 'circle' : 'circles'} remaining`
                  : 'Family circle limit reached'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={28} color="#92400E" />
          </TouchableOpacity>
        )}

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={40} color="#EC4899" />
            <Text style={styles.statValue}>{familyMembers}</Text>
            <Text style={styles.statLabel}>Family Members</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="notifications" size={40} color="#8B5CF6" />
            <Text style={styles.statValue}>{activeReminders}</Text>
            <Text style={styles.statLabel}>Active Reminders</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={40} color="#10B981" />
            <Text style={styles.statValue}>{unreadMessages}</Text>
            <Text style={styles.statLabel}>New Messages</Text>
          </View>
        </View>

        {/* Family Circles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Family Circles</Text>
            <TouchableOpacity onPress={handleAddCircle}>
              <Ionicons
                name={circlesLimitReached ? 'lock-closed' : 'add-circle'}
                size={32}
                color={circlesLimitReached ? '#F59E0B' : '#EC4899'}
              />
            </TouchableOpacity>
          </View>

          {currentFamilyCircles === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Family Circles Yet</Text>
              <Text style={styles.emptyDescription}>
                Create your first family circle to start staying connected with loved ones
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddCircle}
              >
                <Text style={styles.emptyButtonText}>Create Family Circle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.circleCard}>
              <View style={styles.circleIcon}>
                <Ionicons name="people" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.circleInfo}>
                <Text style={styles.circleName}>My Family</Text>
                <Text style={styles.circleMembers}>{familyMembers} members</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {/* Activity Items */}
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="medical" size={28} color="#3B82F6" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Medication Reminder</Text>
              <Text style={styles.activityTime}>Today at 9:00 AM</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="chatbubble" size={28} color="#10B981" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>New message from Sarah</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="calendar" size={28} color="#EC4899" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Doctor appointment tomorrow</Text>
              <Text style={styles.activityTime}>Reminder set</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="call" size={36} color="#EF4444" />
              <Text style={styles.quickActionText}>Emergency Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="videocam" size={36} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Video Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="medical" size={36} color="#3B82F6" />
              <Text style={styles.quickActionText}>Medications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="fitness" size={36} color="#10B981" />
              <Text style={styles.quickActionText}>Health</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, circlesLimitReached && styles.fabLimited]}
        onPress={handleAddCircle}
      >
        <Ionicons
          name={circlesLimitReached ? 'lock-closed' : 'add'}
          size={36}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  premiumBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumContent: {
    flex: 1,
    marginLeft: 16,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#B45309',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  circleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  circleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  circleName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  circleMembers: {
    fontSize: 16,
    color: '#6B7280',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 15,
    color: '#6B7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabLimited: {
    backgroundColor: '#F59E0B',
  },
});
