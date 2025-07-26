import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="floating-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand-section">
              <img src="/logo.svg" alt="DayMatrix" class="footer-logo">
              <span class="footer-brand-text">DayMatrix</span>
            </div>
            <p class="footer-description">
              Transform your productivity with intelligent task prioritization and time management.
            </p>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4 class="link-group-title">Product</h4>
              <nav class="link-list">
                <a routerLink="/dashboard" class="footer-link">Dashboard</a>
                <a routerLink="/tasks" class="footer-link">Tasks</a>
                <a routerLink="/analytics" class="footer-link">Analytics</a>
                <a routerLink="/features" class="footer-link">Features</a>
              </nav>
            </div>
            
            <div class="link-group">
              <h4 class="link-group-title">Company</h4>
              <nav class="link-list">
                <a routerLink="/about" class="footer-link">About</a>
                <a routerLink="/contact" class="footer-link">Contact</a>
                <a routerLink="/careers" class="footer-link">Careers</a>
                <a routerLink="/blog" class="footer-link">Blog</a>
              </nav>
            </div>
            
            <div class="link-group">
              <h4 class="link-group-title">Support</h4>
              <nav class="link-list">
                <a routerLink="/help" class="footer-link">Help Center</a>
                <a routerLink="/documentation" class="footer-link">Documentation</a>
                <a routerLink="/privacy" class="footer-link">Privacy Policy</a>
                <a routerLink="/terms" class="footer-link">Terms of Service</a>
              </nav>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">
              © {{ currentYear }} DayMatrix. All rights reserved.
            </p>
            
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
                <a href="#" class="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
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
export class FooterComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly currentYear = new Date().getFullYear();
  
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
