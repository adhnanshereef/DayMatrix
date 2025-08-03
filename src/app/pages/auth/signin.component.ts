import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, FormsModule],
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
      <div class="auth-container">
        <!-- Left Side - Authentication Form -->
        <div class="auth-left">
          <div class="auth-card">
            <!-- Logo and Header -->
            <div class="auth-header">
              <img src="/logo.svg" alt="DayMatrix Logo" class="auth-logo" />
              <h2 class="signin-title">Sign In</h2>
            </div>

            <!-- Authentication Form -->
            <form class="auth-form" (ngSubmit)="signInWithEmail()" #signinForm="ngForm">
              <!-- Email Input -->
              <div class="input-group">
                <label for="email" class="input-label">Email Address</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    [(ngModel)]="email" 
                    placeholder="Enter your email" 
                    class="auth-input"
                    [class.error]="emailError()"
                    required
                    autocomplete="email"
                    #emailInput="ngModel"
                  />
                </div>
                @if(emailError()) {
                  <span class="error-message">{{ emailError() }}</span>
                }
              </div>

              <!-- Password Input -->
              <div class="input-group">
                <label for="password" class="input-label">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input 
                    [type]="showPassword() ? 'text' : 'password'"
                    id="password"
                    name="password" 
                    [(ngModel)]="password" 
                    placeholder="Enter your password" 
                    class="auth-input password-input"
                    [class.error]="passwordError()"
                    required
                    autocomplete="current-password"
                    #passwordInput="ngModel"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    (click)="togglePasswordVisibility()"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                  >
                    @if(showPassword()) {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                </div>
                @if(passwordError()) {
                  <span class="error-message">{{ passwordError() }}</span>
                }
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="form-options">
                <label class="checkbox-wrapper">
                  <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" class="checkbox">
                  <span class="checkbox-custom">
                    <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </span>
                  <span class="checkbox-label">Remember me</span>
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>

              <!-- Sign In Button -->
              <button 
                type="submit" 
                class="auth-primary"
                [disabled]="isLoading() || !signinForm.valid"
                [class.loading]="isLoading()"
              >
                @if(isLoading()) {
                  <div class="loading-spinner"></div>
                  <span>Signing in...</span>
                } @else {
                  <span>Sign In</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                }
              </button>
            </form>

            <!-- Divider -->
            <div class="auth-divider">
              <span>or continue with</span>
            </div>

            <!-- Social Login -->
            <div class="social-login">
              <button type="button" class="social-btn google-btn" disabled>
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
                <span class="coming-soon">Coming Soon</span>
              </button>
            </div>

            <!-- Sign Up Link -->
            <div class="auth-footer">
              <span>Don't have an account?</span>
              <a routerLink="/signup" class="auth-link">Create account</a>
            </div>
          </div>
        </div>

        <!-- Right Side - Promotional Content -->
        <div class="auth-right">
          <div class="promo-content">
            <div class="promo-header">
              <div class="promo-icon">
                <img src="/logo.svg" alt="DayMatrix Logo" class="promo-logo" />
              </div>
              <h1 class="auth-title">Welcome Back</h1>
              <p class="auth-subtitle">Sign in to your DayMatrix account</p>
              <h2>Transform Your Productivity</h2>
              <p>Join thousands of professionals who have revolutionized their daily workflow with DayMatrix.</p>
            </div>

            <!-- Dynamic Testimonials -->
            <div class="testimonial-container">
              <div class="testimonial" [class.active]="currentTestimonial() === 0">
                <div class="testimonial-content">
                  <blockquote>"DayMatrix helped me increase my productivity by 300%. The Eisenhower Matrix integration is game-changing."</blockquote>
                  <cite>
                    <div class="author-avatar">SM</div>
                    <div class="author-info">
                      <span class="author-name">Sarah Mitchell</span>
                      <span class="author-role">Product Manager at TechCorp</span>
                    </div>
                  </cite>
                </div>
              </div>

              <div class="testimonial" [class.active]="currentTestimonial() === 1">
                <div class="testimonial-content">
                  <blockquote>"Finally, a task management app that actually understands priority. My team's efficiency has skyrocketed."</blockquote>
                  <cite>
                    <div class="author-avatar">JD</div>
                    <div class="author-info">
                      <span class="author-name">James Davis</span>
                      <span class="author-role">Engineering Lead at StartupXYZ</span>
                    </div>
                  </cite>
                </div>
              </div>

              <div class="testimonial" [class.active]="currentTestimonial() === 2">
                <div class="testimonial-content">
                  <blockquote>"The analytics dashboard gives me insights I never had before. I can see exactly where my time goes."</blockquote>
                  <cite>
                    <div class="author-avatar">AL</div>
                    <div class="author-info">
                      <span class="author-name">Alex Liu</span>
                      <span class="author-role">Freelance Designer</span>
                    </div>
                  </cite>
                </div>
              </div>
            </div>

            <!-- Feature Highlights -->
            <div class="feature-highlights">
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <span>Smart Task Prioritization</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <span>Real-time Analytics</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                </svg>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth.component.css'
})
export class SigninComponent implements OnInit, OnDestroy {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  rememberMe = signal(false);
  isLoading = signal(false);
  emailError = signal('');
  passwordError = signal('');
  currentTestimonial = signal(0);

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private testimonialInterval?: number;

  constructor() { }

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const user = await this.supabaseService.isSignedIn();
      if (user) {
        this.router.navigate(['/dashboard']);
      }
      
      // Start testimonial rotation
      this.startTestimonialRotation();
    }
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  private startTestimonialRotation() {
    this.testimonialInterval = window.setInterval(() => {
      this.currentTestimonial.set((this.currentTestimonial() + 1) % 3);
    }, 5000);
  }

  private validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    this.emailError.set('');
    this.passwordError.set('');

    // Email validation
    const emailValue = this.email().trim();
    if (!emailValue) {
      this.emailError.set('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      this.emailError.set('Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    const passwordValue = this.password();
    if (!passwordValue) {
      this.passwordError.set('Password is required');
      isValid = false;
    } else if (passwordValue.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }

  async signInWithEmail() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);
    
    try {
      const { error } = await this.supabaseService.signInWithEmail({
        email: this.email().trim(),
        password: this.password(),
      });
      
      if (error) {
        this.handleSignInError(error);
      } else {
        this.alertService.success('Welcome back! You have been signed in successfully.', 'Sign In Successful');
        await this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      this.alertService.error('An unexpected error occurred. Please try again.', 'Sign In Failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleSignInError(error: any) {
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid email or password')) {
      this.emailError.set('Invalid email or password');
      this.passwordError.set('Invalid email or password');
      this.alertService.error('Invalid email or password. Please check your credentials and try again.', 'Sign In Failed');
    } else if (errorMessage.includes('email not confirmed')) {
      this.emailError.set('Email not confirmed');
      this.alertService.warning('Please check your email and confirm your account before signing in.', 'Email Confirmation Required');
    } else if (errorMessage.includes('too many requests')) {
      this.alertService.warning('Too many sign-in attempts. Please wait a moment before trying again.', 'Rate Limited');
    } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      this.alertService.error('Network connection error. Please check your internet connection and try again.', 'Connection Error');
    } else {
      this.alertService.error('Unable to sign in. Please try again later.', 'Sign In Failed');
    }
  }
}
