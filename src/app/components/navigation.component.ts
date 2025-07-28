import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="floating-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            <img src="/logo.svg" alt="DayMatrix" class="brand-logo">
            <span class="brand-text">DayMatrix</span>
          </a>
        </div>
        
        <div class="nav-menu" [class.nav-menu-open]="isMenuOpen()">
          <div class="nav-links">
            @if(user) {
            <a routerLink="/dashboard" (click)="closeToggleMenu()" routerLinkActive="active" class="nav-link">
              Dashboard
            </a>
            <a routerLink="/tasks" (click)="closeToggleMenu()" routerLinkActive="active" class="nav-link">
              Tasks
            </a>
            <!-- settings -->
            <a routerLink="/settings" class="theme-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </a>
            <!-- <a routerLink="/analytics" (click)="closeToggleMenu()" routerLinkActive="active" class="nav-link">
              Analytics
            </a> -->
          }@else{
             <a routerLink="/" (click)="closeToggleMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              Home
            </a>
            <a routerLink="/signin" (click)="closeToggleMenu()" routerLinkActive="active" class="nav-link">
              SignIn
            </a>
            <a routerLink="/signup" (click)="closeToggleMenu()" routerLinkActive="active" class="nav-link">
              SignUp
            </a>
          }
          </div>
          
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
            <button class="cta-button" (click)="closeToggleMenu()" >
              Get Started
            </button>
            } @else {
            <button class="cta-button" (click)="signOut();closeToggleMenu()" >
              SignOut
             <svg class="ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
            </button>
            }
          </div>
        </div>
        
        <button 
          class="mobile-menu-toggle"
          (click)="toggleMobileMenu()"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  user: User | null = null;
  protected readonly themeService = inject(ThemeService);
  protected readonly isMenuOpen = signal(false);

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
