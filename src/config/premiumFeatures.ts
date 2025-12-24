/**
 * Premium Features Configuration - SeniorConnect
 * Defines what features are available in free vs premium tiers
 */

export interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
  freeLimit?: number | string;
  premiumLimit?: number | string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    icon: 'people',
    title: 'Unlimited Family Circles',
    description: 'Create as many family groups as you need',
    freeLimit: 2,
    premiumLimit: 'Unlimited',
  },
  {
    icon: 'medical',
    title: 'Advanced Medication Reminders',
    description: 'Set up detailed medication schedules with photos',
    freeLimit: 5,
    premiumLimit: 'Unlimited',
  },
  {
    icon: 'call',
    title: 'Emergency Contacts',
    description: 'Store critical contact information',
    freeLimit: 3,
    premiumLimit: 'Unlimited',
  },
  {
    icon: 'videocam',
    title: 'Video Calls',
    description: 'Face-to-face calls with family members',
    freeLimit: 'Basic',
    premiumLimit: 'HD Quality',
  },
  {
    icon: 'fitness',
    title: 'Health Tracking',
    description: 'Monitor vitals and share with caregivers',
    freeLimit: 'Limited',
    premiumLimit: 'Full Access',
  },
  {
    icon: 'cloud',
    title: 'Cloud Sync',
    description: 'Access your data across all devices',
    freeLimit: 'No',
    premiumLimit: 'Yes',
  },
];

export const FREE_TIER_LIMITS = {
  maxFamilyCircles: 2,
  maxMedicationReminders: 5,
  maxEmergencyContacts: 3,
  videoCallsEnabled: false,
  healthTrackingEnabled: false,
  cloudSyncEnabled: false,
  exportEnabled: false,
  adsEnabled: true,
  photoSharingLimit: 10, // photos per month
  appointmentRemindersLimit: 5,
};

export const PREMIUM_TIER_LIMITS = {
  maxFamilyCircles: Infinity,
  maxMedicationReminders: Infinity,
  maxEmergencyContacts: Infinity,
  videoCallsEnabled: true,
  healthTrackingEnabled: true,
  cloudSyncEnabled: true,
  exportEnabled: true,
  adsEnabled: false,
  photoSharingLimit: Infinity,
  appointmentRemindersLimit: Infinity,
};

export function getFeatureLimit(
  feature: keyof typeof FREE_TIER_LIMITS,
  isPremium: boolean
) {
  return isPremium ? PREMIUM_TIER_LIMITS[feature] : FREE_TIER_LIMITS[feature];
}

export function canAccessFeature(feature: string, isPremium: boolean): boolean {
  if (isPremium) return true;

  // Free tier restrictions
  const restrictedFeatures = [
    'video',
    'health-tracking',
    'export',
    'sync',
    'advanced',
    'hd',
  ];

  return !restrictedFeatures.some((r) =>
    feature.toLowerCase().includes(r)
  );
}

// ============================================================================
// HELPER FUNCTIONS FOR SENIORCONNECT
// ============================================================================

/**
 * Check if family circle limit is reached
 */
export function isFamilyCircleLimitReached(
  currentCount: number,
  isPremium: boolean
): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.maxFamilyCircles;
}

/**
 * Get remaining family circles available
 */
export function getRemainingFamilyCircles(
  currentCount: number,
  isPremium: boolean
): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  return Math.max(0, FREE_TIER_LIMITS.maxFamilyCircles - currentCount);
}

/**
 * Check if medication reminder limit is reached
 */
export function isMedicationReminderLimitReached(
  currentCount: number,
  isPremium: boolean
): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.maxMedicationReminders;
}

/**
 * Get remaining medication reminders available
 */
export function getRemainingMedicationReminders(
  currentCount: number,
  isPremium: boolean
): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  return Math.max(0, FREE_TIER_LIMITS.maxMedicationReminders - currentCount);
}

/**
 * Check if emergency contact limit is reached
 */
export function isEmergencyContactLimitReached(
  currentCount: number,
  isPremium: boolean
): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.maxEmergencyContacts;
}

/**
 * Get remaining emergency contacts available
 */
export function getRemainingEmergencyContacts(
  currentCount: number,
  isPremium: boolean
): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  return Math.max(0, FREE_TIER_LIMITS.maxEmergencyContacts - currentCount);
}

/**
 * Check if user can make video calls
 */
export function canMakeVideoCalls(isPremium: boolean): boolean {
  return isPremium && PREMIUM_TIER_LIMITS.videoCallsEnabled;
}

/**
 * Check if user can access health tracking
 */
export function canAccessHealthTracking(isPremium: boolean): boolean {
  return isPremium && PREMIUM_TIER_LIMITS.healthTrackingEnabled;
}

/**
 * Check if user can sync to cloud
 */
export function canSyncToCloud(isPremium: boolean): boolean {
  return isPremium && PREMIUM_TIER_LIMITS.cloudSyncEnabled;
}

/**
 * Check if photo sharing limit is reached
 */
export function isPhotoSharingLimitReached(
  currentCount: number,
  isPremium: boolean
): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.photoSharingLimit;
}

/**
 * Get remaining photos available this month
 */
export function getRemainingPhotos(
  currentCount: number,
  isPremium: boolean
): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  return Math.max(0, FREE_TIER_LIMITS.photoSharingLimit - currentCount);
}
