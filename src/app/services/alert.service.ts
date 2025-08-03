import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  timestamp: Date;
}

export interface AlertConfig {
  position?: AlertPosition;
  duration?: number;
  maxAlerts?: number;
  showTimestamp?: boolean;
  enableSound?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly alerts = signal<Alert[]>([]);
  private readonly config = signal<AlertConfig>({
    position: 'top-right',
    duration: 5000,
    maxAlerts: 5,
    showTimestamp: false,
    enableSound: false
  });

  // Public readonly signals
  public readonly currentAlerts = this.alerts.asReadonly();
  public readonly alertConfig = this.config.asReadonly();
  
  // Computed signals for filtered alerts
  public readonly visibleAlerts = computed(() => {
    const maxAlerts = this.config().maxAlerts || 5;
    return this.alerts().slice(-maxAlerts);
  });

  public readonly hasAlerts = computed(() => this.alerts().length > 0);

  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Show a success alert
   */
  public success(message: string, title?: string, options?: Partial<Alert>): string {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  /**
   * Show an error alert
   */
  public error(message: string, title?: string, options?: Partial<Alert>): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  }

  /**
   * Show a warning alert
   */
  public warning(message: string, title?: string, options?: Partial<Alert>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: 6000, // Slightly longer for warnings
      ...options
    });
  }

  /**
   * Show an info alert
   */
  public info(message: string, title?: string, options?: Partial<Alert>): string {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  /**
   * Show a custom alert
   */
  public show(alertData: Omit<Alert, 'id' | 'timestamp'>): string {
    const alert: Alert = {
      id: this.generateId(),
      duration: this.config().duration,
      dismissible: true,
      timestamp: new Date(),
      ...alertData
    };

    // Add alert to the list
    this.alerts.update(alerts => [...alerts, alert]);

    // Auto-dismiss if duration is set
    if (alert.duration && alert.duration > 0) {
      timer(alert.duration).pipe(take(1)).subscribe(() => {
        this.dismiss(alert.id);
      });
    }

    // Play sound if enabled
    if (this.config().enableSound) {
      this.playNotificationSound(alert.type);
    }

    return alert.id;
  }

  /**
   * Dismiss a specific alert
   */
  public dismiss(alertId: string): void {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== alertId));
  }

  /**
   * Dismiss all alerts
   */
  public dismissAll(): void {
    this.alerts.set([]);
  }

  /**
   * Update alert configuration
   */
  public updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config.update(config => ({ ...config, ...newConfig }));
  }

  /**
   * Get alert by ID
   */
  public getAlert(alertId: string): Alert | undefined {
    return this.alerts().find(alert => alert.id === alertId);
  }

  /**
   * Get alerts by type
   */
  public getAlertsByType(type: AlertType): Alert[] {
    return this.alerts().filter(alert => alert.type === type);
  }

  /**
   * Pause auto-dismiss for a specific alert
   */
  public pauseAutoDismiss(alertId: string): void {
    // Implementation would involve managing timers
    // For now, we'll just update the alert to remove duration
    this.alerts.update(alerts => 
      alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, duration: undefined }
          : alert
      )
    );
  }

  /**
   * Resume auto-dismiss for a specific alert
   */
  public resumeAutoDismiss(alertId: string, duration?: number): void {
    const alert = this.getAlert(alertId);
    if (alert) {
      const dismissDuration = duration || this.config().duration || 5000;
      timer(dismissDuration).pipe(take(1)).subscribe(() => {
        this.dismiss(alertId);
      });
    }
  }

  /**
   * Play notification sound based on alert type
   */
  private playNotificationSound(type: AlertType): void {
    if (typeof Audio !== 'undefined') {
      // Different sounds for different alert types
      const soundMap = {
        success: 'assets/sounds/success.mp3',
        error: 'assets/sounds/error.mp3',
        warning: 'assets/sounds/warning.mp3',
        info: 'assets/sounds/info.mp3'
      };

      try {
        const audio = new Audio(soundMap[type]);
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Silently fail if audio can't be played
        });
      } catch {
        // Silently fail if Audio is not supported
      }
    }
  }

  /**
   * Utility methods for common alert scenarios
   */
  public confirmationAlert(message: string, onConfirm: () => void, onCancel?: () => void): string {
    return this.show({
      type: 'warning',
      title: 'Confirmation Required',
      message,
      duration: 0, // Don't auto-dismiss
      dismissible: true,
      action: {
        label: 'Confirm',
        handler: () => {
          onConfirm();
        }
      }
    });
  }

  public networkErrorAlert(): string {
    return this.error(
      'Please check your internet connection and try again.',
      'Network Error',
      {
        action: {
          label: 'Retry',
          handler: () => {
            // Emit retry event or call callback
            window.location.reload();
          }
        }
      }
    );
  }

  public saveSuccessAlert(itemName: string = 'Item'): string {
    return this.success(`${itemName} has been saved successfully.`, 'Saved');
  }

  public deleteSuccessAlert(itemName: string = 'Item'): string {
    return this.success(`${itemName} has been deleted successfully.`, 'Deleted');
  }

  public validationErrorAlert(errors: string[]): string {
    const message = errors.length === 1 
      ? errors[0] 
      : `Please fix the following issues:\n${errors.map(error => `• ${error}`).join('\n')}`;
    
    return this.error(message, 'Validation Error');
  }
}
