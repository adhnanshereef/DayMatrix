import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { SeoService } from '../../services/seo.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-callback',
  template: `
    <!-- Background Gradient Shapes -->
    <div class="background-gradient-shapes">
      <div class="gradient-oval gradient-oval-1"></div>
      <div class="gradient-oval gradient-oval-2"></div>
      <div class="gradient-oval gradient-oval-3"></div>
      <div class="gradient-oval gradient-oval-4"></div>
      <div class="gradient-oval gradient-oval-5"></div>
    </div>

    <div class="auth-page">
     
        <div class="auth-card callback-card">
          <!-- Logo -->
          <div class="auth-header">
            <img src="/logo.svg" alt="DayMatrix Logo" class="auth-logo" />
          </div>

          <!-- Loading Content -->
          <div class="callback-content">
            <div class="loading-spinner"></div>
            <h2 class="callback-title">Completing Authentication</h2>
            <p class="callback-subtitle">Please wait while we securely sign you in...</p>
          </div>
        </div>
  
    </div>
  `,
  styleUrl: './auth.component.css',
  styles: [`
    .callback-card {
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }

    .callback-content {
      padding: 2rem 0;
    }

    .callback-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 1.5rem 0 0.75rem;
    }

    .callback-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
      opacity: 0.8;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      margin: 0 auto;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
      .callback-card {
        padding: 1.5rem;
      }
      
      .callback-title {
        font-size: 1.25rem;
      }
      
      .callback-subtitle {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);
  private readonly seoService = inject(SeoService);
  private readonly alertService = inject(AlertService);

  async ngOnInit() {
    // Update SEO for callback page
    this.seoService.updateCustomSEO({
      title: 'Authentication - DayMatrix | Completing Your Sign In',
      description: 'Completing your secure authentication to DayMatrix. You\'ll be redirected to your productivity dashboard momentarily to start using the Eisenhower Matrix methodology.',
      keywords: 'DayMatrix authentication, OAuth callback, secure login, Google authentication, sign in process',
      url: 'https://daymatrix.app/auth/callback',
      type: 'website'
    });

    try {
      // Get the current session after OAuth redirect
      const response = await this.supabaseService.getUser();
      
      if (!response) {
        this.alertService.error('Failed to complete authentication. Please try again.', 'Authentication Error');
        this.router.navigate(['/signin']);
        return;
      }

      const { data: { user }, error } = response;
      
      if (error) {
        this.alertService.error('Failed to complete authentication. Please try again.', 'Authentication Error');
        this.router.navigate(['/signin']);
        return;
      }

      if (user) {
        this.alertService.success('Successfully signed in with Google!', 'Welcome to DayMatrix');
        
        // Check for stored return URL from OAuth flow
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl'); // Clean up
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.alertService.warning('Authentication was cancelled or failed. Please try again.', 'Authentication Cancelled');
        this.router.navigate(['/signin']);
      }
    } catch (err) {
      this.alertService.error('An unexpected error occurred during authentication.', 'Authentication Error');
      this.router.navigate(['/signin']);
    }
  }
}
