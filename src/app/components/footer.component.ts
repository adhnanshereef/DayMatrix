import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="modern-footer">
      <div class="footer-container">
        <div class="footer-content">
          <!-- Brand Section -->
          <div class="footer-brand">
            <div class="brand-section">
              <img src="/logo.svg" alt="DayMatrix" class="footer-logo">
              <span class="footer-brand-text">DayMatrix</span>
            </div>
            <p class="footer-description">
              Transform your productivity with intelligent task prioritization and the proven Eisenhower Matrix methodology.
            </p>
          </div>
          
          <!-- Navigation Links -->
          <div class="footer-links">
            <!-- Main Navigation -->
            <div class="link-group">
              <h4 class="link-group-title">Navigation</h4>
              <nav class="link-list">
                @if (!user) {
                  <a routerLink="/" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    Home
                  </a>
                  <a routerLink="/signin" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10,17 15,12 10,7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign In
                  </a>
                  <a routerLink="/signup" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Sign Up
                  </a>
                } @else {
                  <a routerLink="/dashboard" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    </svg>
                    Dashboard
                  </a>
                  <a routerLink="/tasks" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11l3 3 8-8"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98"/>
                    </svg>
                    Tasks
                  </a>
                  <!-- <a routerLink="/analytics" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3v18h18"/>
                      <path d="M18 17l-3-3-4 4-4-4-4 4"/>
                    </svg>
                    Analytics
                  </a> -->
                  <a routerLink="/settings" class="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Settings
                  </a>
                }
              </nav>
            </div>
            
            <!-- Legal & Support -->
            <div class="link-group">
              <h4 class="link-group-title">Legal & Support</h4>
              <nav class="link-list">
                <a routerLink="/privacy" class="footer-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Privacy Policy
                </a>
                <a routerLink="/terms" class="footer-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Terms of Service
                </a>
              </nav>
            </div>

            <!-- Resources -->
            <div class="link-group">
              <h4 class="link-group-title">Resources</h4>
              <nav class="link-list">
                <a href="https://en.wikipedia.org/wiki/First_Things_First_(book)" target="_blank" rel="noopener noreferrer" class="footer-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  Eisenhower Matrix
                </a>
                <a href="https://www.productivitymethods.com" target="_blank" rel="noopener noreferrer" class="footer-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Productivity Tips
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <div class="footer-left">
              <p class="copyright">
                © {{ currentYear }} DayMatrix. All rights reserved.
              </p>
              <div class="developer-credit">
                Developed by 
                <a href="https://www.adhnan.me" target="_blank" rel="noopener noreferrer" class="developer-link">
                  Adhnan
                </a>
              </div>
            </div>
            
            <div class="footer-actions">
              <button (click)="toggleTheme()" class="footer-theme-toggle" aria-label="Toggle theme">
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
              
              <div class="social-links">
                <a href="https://github.com/adhnanshereef/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/adhnanshereef" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="https://www.adhnan.me" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Portfolio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  user: User | null = null;
  protected readonly themeService = inject(ThemeService);
  protected readonly currentYear = new Date().getFullYear();
  
  protected readonly supabaseService = inject(SupabaseService);

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
}
