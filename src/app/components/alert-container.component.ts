import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { AlertService, Alert, AlertType } from '../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-container',
  template: `
    <div class="alert-container" [attr.data-position]="alertService.alertConfig().position">
      @for (alert of alertService.visibleAlerts(); track alert.id) {
        <div 
          class="alert-toast"
          [attr.data-type]="alert.type"
          [class.dismissible]="alert.dismissible"
          (mouseenter)="pauseAutoDismiss(alert.id)"
          (mouseleave)="resumeAutoDismiss(alert.id)">
          
          <!-- Background gradient shapes for visual interest -->
          <div class="alert-gradient-bg"></div>
          
          <!-- Alert icon -->
          <div class="alert-icon">
            @switch (alert.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              }
              @case ('info') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>
          
          <!-- Alert content -->
          <div class="alert-content">
            @if (alert.title) {
              <div class="alert-title">{{ alert.title }}</div>
            }
            <div class="alert-message">{{ alert.message }}</div>
            
            @if (alertService.alertConfig().showTimestamp) {
              <div class="alert-timestamp">
                {{ formatTimestamp(alert.timestamp) }}
              </div>
            }
            
            <!-- Action button (moved inside content for better responsive layout) -->
            @if (alert.action) {
              <div class="alert-actions">
                <button 
                  class="alert-action-btn" 
                  (click)="handleAction(alert)"
                  type="button">
                  {{ alert.action.label }}
                </button>
                @if (alert.type === 'warning' && alert.title === 'Confirmation Required') {
                  <button 
                    class="alert-cancel-btn" 
                    (click)="dismissAlert(alert.id)"
                    type="button">
                    Cancel
                  </button>
                }
              </div>
            }
          </div>
          
          <!-- Dismiss button -->
          @if (alert.dismissible) {
            <button 
              class="alert-dismiss-btn" 
              (click)="dismissAlert(alert.id)"
              type="button"
              aria-label="Dismiss alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }
          
          <!-- Progress bar for auto-dismiss -->
          @if (alert.duration && alert.duration > 0) {
            <div class="alert-progress">
              <div class="alert-progress-bar" [style.animation-duration]="alert.duration + 'ms'"></div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './alert-container.component.css'
})
export class AlertContainerComponent implements OnInit, OnDestroy {
  protected readonly alertService = inject(AlertService);
  
  private subscription?: Subscription;

  ngOnInit(): void {
    // Any initialization logic if needed
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  protected dismissAlert(alertId: string): void {
    this.alertService.dismiss(alertId);
  }

  protected handleAction(alert: Alert): void {
    if (alert.action) {
      alert.action.handler();
      // Optionally dismiss the alert after action
      this.alertService.dismiss(alert.id);
    }
  }

  protected pauseAutoDismiss(alertId: string): void {
    this.alertService.pauseAutoDismiss(alertId);
  }

  protected resumeAutoDismiss(alertId: string): void {
    this.alertService.resumeAutoDismiss(alertId);
  }

  protected formatTimestamp(timestamp: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(timestamp);
  }
}
