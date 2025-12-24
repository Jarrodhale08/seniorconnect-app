/**
 * useNotificationInit Hook - SeniorConnect
 *
 * Initializes notification service and manages permission requests on app startup.
 */

import { useEffect, useState } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import notificationService from '../services/notification.service';

export function useNotificationInit() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    settings,
    hasPermission,
    permissionAsked,
    setPermission,
    setPermissionAsked,
    setPushToken,
  } = useNotificationStore();

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize notification service
        await notificationService.initialize();

        // Check if notifications are enabled in settings
        if (!settings.pushEnabled) {
          setIsReady(true);
          return;
        }

        // Check current permission status
        const isEnabled = await notificationService.areNotificationsEnabled();
        setPermission(isEnabled);

        // Request permissions if not yet asked
        if (!permissionAsked && !isEnabled) {
          const granted = await notificationService.requestPermissions();
          setPermission(granted);
          setPermissionAsked(true);

          // Get push token if permission granted
          if (granted) {
            const tokenData = await notificationService.getPushToken();
            if (tokenData) {
              setPushToken(tokenData.token);
            }
          }
        } else if (isEnabled) {
          // Already have permission, get push token
          const tokenData = await notificationService.getPushToken();
          if (tokenData) {
            setPushToken(tokenData.token);
          }
        }

        setIsReady(true);
      } catch (err) {
        console.error('Notification init error:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
        setIsReady(true); // Still mark as ready so app can function
      }
    };

    init();
  }, [
    settings.pushEnabled,
    permissionAsked,
    setPermission,
    setPermissionAsked,
    setPushToken,
  ]);

  return { isReady, error, hasPermission };
}

export default useNotificationInit;
