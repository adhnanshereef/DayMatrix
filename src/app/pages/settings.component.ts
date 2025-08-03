import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { SeoService } from '../services/seo.service';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <!-- Background Gradient Shapes -->
    <div class="background-gradient-shapes">
      <div class="gradient-oval gradient-oval-1"></div>
      <div class="gradient-oval gradient-oval-2"></div>
      <div class="gradient-oval gradient-oval-3"></div>
      <div class="gradient-oval gradient-oval-4"></div>
      <div class="gradient-oval gradient-oval-5"></div>
    </div>

    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account and personalize your DayMatrix experience</p>
      </div>

      <!-- Settings Grid -->
      <div class="settings-grid">
        <!-- Profile Section -->
        <div class="settings-section profile-section">
          <div class="section-header">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 class="section-title">Profile Information</h2>
          </div>
          
          <div class="profile-content">
            <div class="profile-avatar">
              <div class="avatar-circle">
                <span class="avatar-text">{{ user?.user_metadata?.['displayName'] ? (user?.user_metadata?.['displayName']?.[0] ?? '?') : '?' }}</span>
              </div>
            </div>
            
            <div class="profile-details">
              <div class="profile-field">
                <label class="field-label">Display Name</label>
                <div class="field-content">
                  <span class="field-value">{{ user?.user_metadata?.['displayName'] || 'No Name Set' }}</span>
                  <button class="edit-btn" (click)="openEditModal()" type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="profile-field">
                <label class="field-label">Email Address</label>
                <div class="field-content">
                  <span class="field-value">{{ user?.email }}</span>
                  <div class="email-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="settings-section preferences-section">
          <div class="section-header">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h2 class="section-title">Preferences</h2>
          </div>
          
          <div class="preferences-content">
            <div class="preference-item">
              <div class="preference-info">
                <h3 class="preference-title">Theme</h3>
                <p class="preference-description">Choose your preferred color scheme</p>
              </div>
              <button class="theme-toggle" (click)="toggleTheme()" type="button">
                @if (themeService.currentTheme() === 'dark') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  <span>Dark Mode</span>
                } @else {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                  <span>Light Mode</span>
                }
              </button>
            </div>
            
            <div class="preference-item">
              <div class="preference-info">
                <h3 class="preference-title">Notifications</h3>
                <p class="preference-description">Manage task and deadline notifications</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" [checked]="notificationsEnabled()" (change)="toggleNotifications()" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Account Actions Section -->
        <div class="settings-section actions-section">
          <div class="section-header">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v6m0 0l4-4m-4 4L8 3"/>
                <path d="M1 12h6m0 0L3 8m4 4l-4 4"/>
                <path d="M23 12h-6m0 0l4-4m-4 4l4 4"/>
                <path d="M12 23v-6m0 0l4 4m-4-4l-4 4"/>
              </svg>
            </div>
            <h2 class="section-title">Account Actions</h2>
          </div>
          
          <div class="actions-content">
            <button class="action-btn signout-btn" (click)="signOut()" type="button">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div class="action-content">
                <span class="action-title">Sign Out</span>
                <span class="action-description">Sign out of your account</span>
              </div>
            </button>
            
            <button class="action-btn danger-btn" (click)="showDeleteConfirmation = true" type="button">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </div>
              <div class="action-content">
                <span class="action-title">Delete Account</span>
                <span class="action-description">Permanently delete your account and all data</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Name Modal -->
    @if (showEditModal) {
      <div class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Edit Display Name</h3>
            <button class="modal-close" (click)="closeEditModal()" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <form (submit)="submitEditName(); $event.preventDefault()" class="modal-form">
            <div class="form-group">
              <label class="form-label">Display Name</label>
              <input 
                class="form-input" 
                [(ngModel)]="editNameValue" 
                name="editNameValue" 
                placeholder="Enter your display name" 
                required 
                maxlength="50"
                type="text" />
            </div>
            
            <div class="modal-actions">
              <button class="btn btn-primary" type="submit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Save Changes
              </button>
              <button class="btn btn-secondary" type="button" (click)="closeEditModal()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Account Confirmation Modal -->
    @if (showDeleteConfirmation) {
      <div class="modal-overlay" (click)="showDeleteConfirmation = false">
        <div class="modal-container danger-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="danger-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 class="modal-title">Delete Account</h3>
            <button class="modal-close" (click)="showDeleteConfirmation = false" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-content">
            <p class="danger-warning">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div class="confirmation-list">
              <div class="confirmation-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                All your tasks will be permanently deleted
              </div>
              <div class="confirmation-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Your productivity data will be lost
              </div>
              <div class="confirmation-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                This action cannot be reversed
              </div>
            </div>
            
            <form (submit)="confirmDeleteAccount(); $event.preventDefault()" class="delete-form">
              <div class="form-group">
                <label class="form-label">Type "DELETE" to confirm</label>
                <input 
                  class="form-input danger-input" 
                  [(ngModel)]="deleteConfirmationText" 
                  name="deleteConfirmationText" 
                  placeholder="DELETE" 
                  required 
                  type="text" />
              </div>
              
              <div class="modal-actions">
                <button 
                  class="btn btn-danger" 
                  type="submit" 
                  [disabled]="deleteConfirmationText !== 'DELETE'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Delete Account Forever
                </button>
                <button class="btn btn-secondary" type="button" (click)="showDeleteConfirmation = false">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
    styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
    user: User | null = null;
    showEditModal = false;
    showDeleteConfirmation = false;
    editNameValue = '';
    deleteConfirmationText = '';
    
    notificationsEnabled = signal(true);

    protected readonly supabaseService = inject(SupabaseService);
    protected readonly themeService = inject(ThemeService);
    private readonly seoService = inject(SeoService);
    private readonly router = inject(Router);
    private readonly alertService = inject(AlertService);

    ngOnInit(): void {
        // Update SEO for settings page
        this.seoService.updateCustomSEO({
            title: 'Settings - DayMatrix | Customize Your Productivity Experience',
            description: 'Personalize your DayMatrix experience with customizable settings. Configure preferences, manage account details, customize notifications, and optimize your productivity workflow for maximum effectiveness.',
            keywords: 'DayMatrix settings, account management, productivity preferences, app configuration, notification settings, workflow customization, user preferences, productivity optimization settings',
            url: 'https://daymatrix.app/settings',
            type: 'webapp'
        });

        if (typeof window !== 'undefined') {
            this.supabaseService.user$.subscribe(user => {
                this.user = user;
            });
        }
    }

    async signOut(): Promise<void> {
        await this.supabaseService.signOut();
        this.user = null;
        this.router.navigate(['/signin']);
    }

    openEditModal() {
      this.editNameValue = this.user?.user_metadata?.['displayName'] || '';
      this.showEditModal = true;
    }
    
    closeEditModal() {
      this.showEditModal = false;
      this.editNameValue = '';
    }
    
    async submitEditName() {
      if (!this.editNameValue.trim()) return;
      const { error } = await this.supabaseService.editName(this.editNameValue.trim());
      if (!error) {
        if (this.user) this.user.user_metadata['displayName'] = this.editNameValue.trim();
        this.closeEditModal();
        this.alertService.success('Your name has been updated successfully!', 'Profile Updated');
      } else {
        this.alertService.error('Failed to update your name. Please try again.', 'Update Failed');
      }
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    toggleNotifications(): void {
        this.notificationsEnabled.update(enabled => !enabled);
        // Here you would implement actual notification preference saving
    }

    confirmDeleteAccount(): void {
        if (this.deleteConfirmationText === 'DELETE') {
            // Here you would implement actual account deletion
            this.alertService.success('Currently Cannot Delete Account. This feature will be implemented soon. If you want send email to "contact.day@adhnan.tech"', 'Account Deletion');
            this.showDeleteConfirmation = false;
            this.deleteConfirmationText = '';
        }
    }
}
