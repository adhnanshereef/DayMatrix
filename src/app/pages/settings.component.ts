import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { SeoService } from '../services/seo.service';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="settings-bg">
      <div class="settings-card glass">
        <h1 class="settings-title">Settings</h1>
        <div class="settings-user">
          <div class="settings-avatar">
            <span>{{ user?.user_metadata?.['displayName'] ? (user?.user_metadata?.['displayName']?.[0] ?? '?') : '?' }}</span>
          </div>
          <div class="settings-user-info">
            <div class="settings-user-name">
              <span>{{ user?.user_metadata?.['displayName'] || 'No Name' }}</span>
              <button class="edit-btn" (click)="openEditModal()" title="Edit Name">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
              </button>
            </div>
            <div class="settings-user-email">{{ user?.email }}</div>
          </div>
        </div>
        <button class="delete-btn" (click)="showDeleteModal = true">Delete Account</button>
        <button class="signout-btn" (click)="signOut()">Sign Out</button>
      </div>
      @if (showEditModal) {
        <div class="modal-overlay">
          <div class="modal glass-intense">
            <h2>Edit Name</h2>
            <form (submit)="submitEditName()">
              <input class="modal-input" [(ngModel)]="editNameValue" name="editNameValue" placeholder="Enter new name" required />
              <div class="modal-actions">
                <button class="modal-save" type="submit">Save</button>
                <button class="modal-cancel" type="button" (click)="closeEditModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }
      @if (showDeleteModal) {
        <div class="modal-overlay">
          <div class="modal glass-intense">
            <h2>Delete Account</h2>
            <form (submit)="deleteAccount()">
              <input class="modal-input" type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required />
              <div class="modal-actions">
                <button class="modal-save" type="submit">Delete</button>
                <button class="modal-cancel" type="button" (click)="showDeleteModal = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .settings-bg {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      position: relative;
    }
    .settings-card {
      max-width: 420px;
      width: 100%;
      padding: 56px 36px 40px 36px;
      border-radius: 28px;
      box-shadow: 0 12px 48px var(--shadow-color);
      position: relative;
      z-index: 2;
      text-align: center;
      overflow: hidden;
    }
    .settings-title {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 32px;
    }
    .settings-user {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 32px;
      justify-content: center;
    }
    .settings-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: #fff;
      font-weight: 700;
      box-shadow: 0 4px 16px var(--primary-color);
    }
    .settings-user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .settings-user-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-color);
    }
    .edit-btn {
      background: none;
      border: none;
      padding: 2px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .edit-btn:hover {
      background: var(--surface-color);
    }
    .settings-user-email {
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .signout-btn {
      margin-top: 32px;
      width: 100%;
      padding: 14px 0;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      color: white;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px var(--shadow-color);
      transition: background 0.3s;
    }
    .signout-btn:hover {
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    }
    .delete-btn {
      margin-top: 12px;
      width: 100%;
      padding: 14px 0;
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--accent-color);
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px var(--shadow-color);
      transition: background 0.3s;
    }
    .delete-btn:hover {
      background: var(--accent-color);
      color: #fff;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.25);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s;
    }
    .modal {
      min-width: 320px;
      max-width: 95vw;
      padding: 36px 24px 24px 24px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 8px 32px var(--shadow-color);
      position: relative;
      z-index: 10001;
    }
    .modal h2 {
      font-size: 1.3rem;
      color: var(--primary-color);
      margin-bottom: 18px;
    }
    .modal-input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      background: var(--surface-color);
      font-size: 1rem;
      color: var(--text-color);
      margin-bottom: 18px;
      outline: none;
      transition: border 0.2s;
    }
    .modal-input:focus {
      border-color: var(--primary-color);
    }
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .modal-save {
      padding: 10px 24px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      color: white;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: background 0.3s;
    }
    .modal-save:hover {
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    }
    .modal-cancel {
      padding: 10px 24px;
      border-radius: 10px;
      background: var(--surface-color);
      color: var(--primary-color);
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: background 0.3s;
    }
    .modal-cancel:hover {
      background: var(--primary-color);
      color: #fff;
    }
    @media (max-width: 600px) {
      .settings-card {
        padding: 24px 6px 18px 6px;
        max-width: 99vw;
      }
      .settings-title {
        font-size: 1.3rem;
      }
      .settings-avatar {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }
      .modal {
        min-width: 90vw;
        padding: 18px 6px 12px 6px;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
    user: User | null = null;
    showEditModal = false;
    editNameValue = '';
    showDeleteModal = false;
    password = '';

    protected readonly supabaseService = inject(SupabaseService);
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

    deleteAccount() {
        // if(this.password.trim() === '') {
        //     this.alertService.warning('Please enter your password to confirm account deletion.', 'Password Required');
        //     return;
        // }
        
        // this.alertService.confirmationAlert(
        //     'This will permanently delete your account and all your data. This action cannot be undone.',
        //     () => {
        //         this.supabaseService.deleteAccount(this.password).then(() => {
        //             this.alertService.success('Your account has been deleted.', 'Account Deleted');
        //             this.router.navigate(['/signin']);
        //         }).catch(error => {
        //             if (error.message.includes('Invalid login credentials')) {
        //                 this.alertService.error('Incorrect password. Please try again.', 'Authentication Failed');
        //             } else {
        //                 this.alertService.error('Failed to delete account. Please try again later.', 'Delete Failed');
        //             }
        //         });
        //     }
        // );
    }

}
