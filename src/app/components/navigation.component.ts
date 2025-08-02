import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="modern-nav">
      <!-- Background Gradient Shapes for Visual Interest -->
      <div class="nav-gradient-shapes">
        <div class="gradient-oval nav-oval-1"></div>
        <div class="gradient-oval nav-oval-2"></div>
        <div class="gradient-oval nav-oval-3"></div>
      </div>
      
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            <img src="/logo.svg" alt="DayMatrix" class="brand-logo">
            <span class="brand-text">DayMatrix</span>
          </a>
        </div>
        
        <!-- Center Navigation Links -->
        <div class="nav-center" [class.nav-center-hidden]="isMenuOpen()">
          @if(user) {
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              </svg>
              <span>Dashboard</span>
            </a>
            <a routerLink="/tasks" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3 8-8"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98"/>
              </svg>
              <span>Tasks</span>
            </a>
          } @else {
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span>Home</span>
            </a>
            <a routerLink="/signin" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Sign In</span>
            </a>
            <a routerLink="/signup" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span>Sign Up</span>
            </a>
          }
        </div>
        
     <div class="nav-right"> 
         <!-- Right Side Actions -->
        <div class="nav-actions">
          <button (click)="toggleTheme()" class="theme-toggle" aria-label="Toggle theme">
            @if (themeService.currentTheme() === 'dark') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>
          
          @if (!user) {
            <button routerLink="/signup" class="cta-button">
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </button>
          } @else {
            <!-- User Dropdown -->
            <div class="user-dropdown" [class.user-dropdown-open]="isUserDropdownOpen()">
              <button 
                (click)="toggleUserDropdown()" 
                class="user-avatar-button"
                aria-label="User menu"
              >
                <div class="user-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>
              
              <div class="dropdown-menu">
                <a routerLink="/settings" (click)="closeAllDropdowns()" class="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </a>
                <button (click)="signOut(); closeAllDropdowns()" class="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          }
          
        </div>
        
        <!-- Mobile Menu Toggle -->
        <button 
          class="mobile-menu-toggle"
          [class.mobile-menu-open]="isMenuOpen()"
          (click)="toggleMobileMenu()"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
    
        <!-- Mobile Responsive Menu -->
        <div class="mobile-nav-menu" [class.mobile-nav-open]="isMenuOpen()">
          @if(user) {
            <a routerLink="/dashboard" (click)="closeAllDropdowns()" routerLinkActive="active" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              </svg>
              Dashboard
            </a>
            <a routerLink="/tasks" (click)="closeAllDropdowns()" routerLinkActive="active" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3 8-8"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98"/>
              </svg>
              Tasks
            </a>
            <a routerLink="/settings" (click)="closeAllDropdowns()" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </a>
            <!-- Theme Toggle in Mobile Menu for small screens -->
            <button (click)="toggleTheme(); closeAllDropdowns()" class="mobile-theme-toggle">
              @if (themeService.currentTheme() === 'dark') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              }
              Toggle Theme
            </button>
            <button (click)="signOut(); closeAllDropdowns()" class="mobile-nav-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          } @else {
            <a routerLink="/" (click)="closeAllDropdowns()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Home
            </a>
            <a routerLink="/signin" (click)="closeAllDropdowns()" routerLinkActive="active" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In
            </a>
            <a routerLink="/signup" (click)="closeAllDropdowns()" routerLinkActive="active" class="mobile-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Sign Up
            </a>
            <!-- Theme Toggle in Mobile Menu for small screens -->
            <button (click)="toggleTheme(); closeAllDropdowns()" class="mobile-theme-toggle">
              @if (themeService.currentTheme() === 'dark') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              }
              Toggle Theme
            </button>
            <button routerLink="/signup" (click)="closeAllDropdowns()" class="mobile-nav-action">
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </button>
          }
        </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  user: User | null = null;
  protected readonly themeService = inject(ThemeService);
  protected readonly isMenuOpen = signal(false);
  protected readonly isUserDropdownOpen = signal(false);

  protected readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.supabaseService.user$.subscribe(user => {
        this.user = user;
      });
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleMobileMenu(): void {
    this.isMenuOpen.update(open => !open);
    // Close user dropdown when mobile menu opens
    if (this.isMenuOpen()) {
      this.isUserDropdownOpen.set(false);
    }
  }

  protected toggleUserDropdown(): void {
    this.isUserDropdownOpen.update(open => !open);
    // Close mobile menu when user dropdown opens
    if (this.isUserDropdownOpen()) {
      this.isMenuOpen.set(false);
    }
  }

  protected closeAllDropdowns(): void {
    this.isMenuOpen.set(false);
    this.isUserDropdownOpen.set(false);
  }

  protected closeToggleMenu() {
    this.isMenuOpen.set(false);
  }

  async signOut(): Promise<void> {
    await this.supabaseService.signOut();
    this.user = null;
    this.router.navigate(['/signin']);
  }
}
