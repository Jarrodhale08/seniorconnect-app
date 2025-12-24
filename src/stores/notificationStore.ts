/**
 * Notification Store - SeniorConnect
 *
 * Zustand store for notification settings with AsyncStorage persistence.
 * Manages notification preferences and reminder schedules.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationSettings {
  // Master toggle
  pushEnabled: boolean;

  // Notification categories
  medicationReminders: boolean;
  familyUpdates: boolean;
  healthCheckIns: boolean;
  emergencyAlerts: boolean;
  appointmentReminders: boolean;

  // Reminder time for daily notifications
  reminderTime: {
    hour: number;
    minute: number;
  };

  // Health check-in schedule (weekly)
  healthCheckInDay: number; // 1=Sunday, 2=Monday, etc.
  healthCheckInTime: {
    hour: number;
    minute: number;
  };
}

export interface NotificationState {
  // Settings
  settings: NotificationSettings;

  // Permission status
  hasPermission: boolean;
  permissionAsked: boolean;

  // Push token
  pushToken: string | null;

  // Actions
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  setPermission: (hasPermission: boolean) => void;
  setPermissionAsked: (asked: boolean) => void;
  setPushToken: (token: string | null) => void;
  toggleNotificationCategory: (category: keyof Omit<NotificationSettings, 'reminderTime' | 'healthCheckInDay' | 'healthCheckInTime'>) => void;
  setReminderTime: (hour: number, minute: number) => void;
  setHealthCheckInSchedule: (day: number, hour: number, minute: number) => void;
  reset: () => void;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  medicationReminders: true,
  familyUpdates: true,
  healthCheckIns: true,
  emergencyAlerts: true,
  appointmentReminders: true,
  reminderTime: {
    hour: 9, // 9 AM
    minute: 0,
  },
  healthCheckInDay: 2, // Monday
  healthCheckInTime: {
    hour: 10, // 10 AM
    minute: 0,
  },
};

// ============================================================================
// STORE
// ============================================================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      hasPermission: false,
      permissionAsked: false,
      pushToken: null,

      // Update settings
      updateSettings: (newSettings) => {
        set({
          settings: {
            ...get().settings,
            ...newSettings,
          },
        });
      },

      // Set permission status
      setPermission: (hasPermission) => {
        set({ hasPermission });
      },

      // Set if permission was asked
      setPermissionAsked: (asked) => {
        set({ permissionAsked: asked });
      },

      // Set push token
      setPushToken: (token) => {
        set({ pushToken: token });
      },

      // Toggle notification category
      toggleNotificationCategory: (category) => {
        const settings = get().settings;
        set({
          settings: {
            ...settings,
            [category]: !settings[category],
          },
        });
      },

      // Set reminder time
      setReminderTime: (hour, minute) => {
        const settings = get().settings;
        set({
          settings: {
            ...settings,
            reminderTime: { hour, minute },
          },
        });
      },

      // Set health check-in schedule
      setHealthCheckInSchedule: (day, hour, minute) => {
        const settings = get().settings;
        set({
          settings: {
            ...settings,
            healthCheckInDay: day,
            healthCheckInTime: { hour, minute },
          },
        });
      },

      // Reset to defaults
      reset: () => {
        set({
          settings: DEFAULT_SETTINGS,
          hasPermission: false,
          permissionAsked: false,
          pushToken: null,
        });
      },
    }),
    {
      name: 'seniorconnect-notifications',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        permissionAsked: state.permissionAsked,
      }),
    }
  )
);

export default useNotificationStore;
