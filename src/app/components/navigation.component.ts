import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              Home
            </a>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              Dashboard
            </a>
            <a routerLink="/tasks" routerLinkActive="active" class="nav-link">
              Tasks
            </a>
            <a routerLink="/analytics" routerLinkActive="active" class="nav-link">
              Analytics
            </a>
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
            
            <button class="cta-button">
              Get Started
            </button>
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
export class NavigationComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly isMenuOpen = signal(false);
  
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  protected toggleMobileMenu(): void {
    this.isMenuOpen.update(open => !open);
  }
}
