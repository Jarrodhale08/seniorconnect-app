/**
 * Notification Service - SeniorConnect
 *
 * Manages push notifications using expo-notifications.
 * Handles permission requests, local notifications, and push token registration.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ============================================================================
// ANDROID CHANNELS
// ============================================================================

const ANDROID_CHANNELS = [
  {
    id: 'default',
    name: 'Default Notifications',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#EC4899',
  },
  {
    id: 'medication-reminders',
    name: 'Medication Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#3B82F6',
    sound: 'default',
  },
  {
    id: 'family-updates',
    name: 'Family Updates',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#10B981',
  },
  {
    id: 'health-checkins',
    name: 'Health Check-ins',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#8B5CF6',
  },
];

// ============================================================================
// TYPES
// ============================================================================

export interface PushToken {
  token: string;
  type: 'expo' | 'apns' | 'fcm';
}

export interface NotificationData {
  [key: string]: any;
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

class NotificationService {
  private pushToken: string | null = null;
  private isInitialized = false;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure Android channels
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  /**
   * Set up Android notification channels
   */
  private async setupAndroidChannels(): Promise<void> {
    for (const channel of ANDROID_CHANNELS) {
      await Notifications.setNotificationChannelAsync(channel.id, channel);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Get push notification token
   */
  async getPushToken(): Promise<PushToken | null> {
    if (this.pushToken) {
      return {
        token: this.pushToken,
        type: 'expo',
      };
    }

    if (!Device.isDevice) {
      console.warn('Push tokens only work on physical devices');
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn('EAS project ID not found');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.pushToken = token.data;
      return {
        token: token.data,
        type: 'expo',
      };
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: NotificationData,
    channelId: string = 'default'
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' && { channelId }),
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Schedule daily medication reminder
   */
  async scheduleDailyMedicationReminder(
    hour: number,
    minute: number,
    medicationName: string,
    dosage: string
  ): Promise<string> {
    return this.scheduleNotification(
      'Medication Reminder',
      `Time to take ${medicationName} (${dosage})`,
      {
        hour,
        minute,
        repeats: true,
      },
      {
        type: 'medication',
        medicationName,
        dosage,
      },
      'medication-reminders'
    );
  }

  /**
   * Schedule weekly health check-in reminder
   */
  async scheduleWeeklyHealthCheckIn(
    weekday: number, // 1 = Sunday, 2 = Monday, etc.
    hour: number,
    minute: number
  ): Promise<string> {
    return this.scheduleNotification(
      'Weekly Health Check-in',
      'Time to log your health vitals and share with family',
      {
        weekday,
        hour,
        minute,
        repeats: true,
      },
      {
        type: 'health-checkin',
      },
      'health-checkins'
    );
  }

  /**
   * Send immediate notification
   */
  async sendImmediateNotification(
    title: string,
    body: string,
    data?: NotificationData,
    channelId: string = 'default'
  ): Promise<string> {
    return this.scheduleNotification(
      title,
      body,
      null, // null = immediate
      data,
      channelId
    );
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Dismiss a notification
   */
  async dismissNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
      throw error;
    }
  }

  /**
   * Dismiss all notifications
   */
  async dismissAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Failed to dismiss all notifications:', error);
      throw error;
    }
  }

  /**
   * Set badge count (iOS)
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
      throw error;
    }
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Remove notification listener
   */
  removeNotificationListener(subscription: Notifications.Subscription): void {
    subscription.remove();
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export default new NotificationService();
