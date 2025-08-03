import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-signup',
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
              <h2 class="signin-title">Create Account</h2>
            </div>

            <!-- Authentication Form -->
            <form class="auth-form" (ngSubmit)="signUp()" #signupForm="ngForm">
              <!-- Full Name Input -->
              <div class="input-group">
                <label for="name" class="input-label">Full Name</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    [(ngModel)]="name" 
                    placeholder="Enter your full name" 
                    class="auth-input"
                    [class.error]="nameError()"
                    required
                    autocomplete="name"
                    #nameInput="ngModel"
                  />
                </div>
                @if(nameError()) {
                  <span class="error-message">{{ nameError() }}</span>
                }
              </div>

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
                    placeholder="Enter your email address" 
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
                    placeholder="Create a strong password" 
                    class="auth-input password-input"
                    [class.error]="passwordError()"
                    required
                    autocomplete="new-password"
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
                
                <!-- Password Strength Indicator -->
                @if(password()) {
                  <div class="password-strength">
                    <div class="strength-bar">
                      <div class="strength-fill" [class]="passwordStrength().class" [style.width.%]="passwordStrength().score * 25"></div>
                    </div>
                    <span class="strength-text" [class]="passwordStrength().class">{{ passwordStrength().text }}</span>
                  </div>
                }
              </div>

              <!-- Confirm Password Input -->
              <div class="input-group">
                <label for="confirmPassword" class="input-label">Confirm Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input 
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    id="confirmPassword"
                    name="confirmPassword" 
                    [(ngModel)]="confirmPassword" 
                    placeholder="Confirm your password" 
                    class="auth-input password-input"
                    [class.error]="confirmPasswordError()"
                    required
                    autocomplete="new-password"
                    #confirmPasswordInput="ngModel"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    (click)="toggleConfirmPasswordVisibility()"
                    [attr.aria-label]="showConfirmPassword() ? 'Hide password' : 'Show password'"
                  >
                    @if(showConfirmPassword()) {
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
                @if(confirmPasswordError()) {
                  <span class="error-message">{{ confirmPasswordError() }}</span>
                }
              </div>

              <!-- Sign Up Button -->
              <button 
                type="submit" 
                class="auth-primary"
                [disabled]="isLoading() || !signupForm.valid || !isFormValid()"
                [class.loading]="isLoading()"
              >
                @if(isLoading()) {
                  <div class="loading-spinner"></div>
                  <span>Creating account...</span>
                } @else {
                  <span>Create Account</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
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
              <button 
                type="button" 
                class="social-btn google-btn" 
                (click)="signUpWithGoogle()" 
                [disabled]="isLoading()"
                [class.loading]="isLoading()"
              >
                @if(isLoading()) {
                  <div class="loading-spinner"></div>
                  <span>Creating account with Google...</span>
                } @else {
                  <svg class="social-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                }
              </button>
            </div>

            <!-- Sign In Link -->
            <div class="auth-footer">
              <span>Already have an account?</span>
              <a routerLink="/signin" class="auth-link">Sign in</a>
            </div>
          </div>
           <!-- Terms and Policy Agreement -->
      <div class="terms-agreement">
        <div class="terms-box">
          <div class="terms-content">
            <svg class="terms-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <p>
              By signing up, you agree to our 
              <a href="/terms" target="_blank" class="terms-link">Terms of Service</a> 
              and 
              <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>.
              We're committed to protecting your data and providing a secure experience.
            </p>
          </div>
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
              <h1 class="auth-title">Join DayMatrix</h1>
              <p class="auth-subtitle">Start your productivity journey today</p>
              <h2>Transform Your Workflow</h2>
              <p>Join thousands of professionals who have revolutionized their daily productivity with DayMatrix's powerful task management system.</p>
            </div>

            <!-- Dynamic Benefits -->
            <div class="testimonial-container">
              <div class="testimonial" [class.active]="currentBenefit() === 0">
                <div class="testimonial-content">
                  <div class="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11l3 3l8-8"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"/>
                    </svg>
                  </div>
                  <h3>Eisenhower Matrix</h3>
                  <p>Prioritize tasks using the proven urgent-important framework</p>
                </div>
              </div>

              <div class="testimonial" [class.active]="currentBenefit() === 1">
                <div class="testimonial-content">
                  <div class="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <h3>Boost Productivity</h3>
                  <p>Increase your daily productivity by up to 300% with smart task management</p>
                </div>
              </div>

              <div class="testimonial" [class.active]="currentBenefit() === 2">
                <div class="testimonial-content">
                  <div class="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3>Team Collaboration</h3>
                  <p>Work seamlessly with your team and track progress together</p>
                </div>
              </div>
            </div>

            <!-- Features List -->
            <div class="features-list">
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                <span>Free to start</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Secure & private</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span>Real-time notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>     
    </div>
  `,
    styleUrl: './auth.component.css'
})
export class SignupComponent implements OnInit, OnDestroy {
    name = signal('');
    email = signal('');
    password = signal('');
    confirmPassword = signal('');
    showPassword = signal(false);
    showConfirmPassword = signal(false);
    isLoading = signal(false);
    nameError = signal('');
    emailError = signal('');
    passwordError = signal('');
    confirmPasswordError = signal('');
    currentBenefit = signal(0);

    private readonly supabaseService = inject(SupabaseService);
    private readonly router = inject(Router);
    private readonly alertService = inject(AlertService);
    private benefitInterval?: number;

    // Computed password strength
    passwordStrength = computed(() => {
        const pwd = this.password();
        if (!pwd) return { score: 0, text: '', class: '' };

        let score = 0;
        let text = '';
        let className = '';

        // Length check
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        // Determine strength
        if (score <= 2) {
            text = 'Weak';
            className = 'strength-weak';
        } else if (score <= 4) {
            text = 'Good';
            className = 'strength-good';
        } else if (score <= 5) {
            text = 'Strong';
            className = 'strength-strong';
        } else {
            text = 'Very Strong';
            className = 'strength-very-strong';
        }

        return { score: Math.min(score, 4), text, class: className };
    });

    constructor() { }

    async ngOnInit() {
        if (typeof window !== 'undefined') {
            const user = await this.supabaseService.isSignedIn();
            if (user) {
                this.router.navigate(['/dashboard']);
            }

            // Start benefit rotation
            this.startBenefitRotation();
        }
    }

    ngOnDestroy() {
        if (this.benefitInterval) {
            clearInterval(this.benefitInterval);
        }
    }

    togglePasswordVisibility() {
        this.showPassword.set(!this.showPassword());
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword.set(!this.showConfirmPassword());
    }

    private startBenefitRotation() {
        this.benefitInterval = window.setInterval(() => {
            this.currentBenefit.set((this.currentBenefit() + 1) % 3);
        }, 4000);
    }

    private validateForm(): boolean {
        let isValid = true;

        // Reset errors
        this.nameError.set('');
        this.emailError.set('');
        this.passwordError.set('');
        this.confirmPasswordError.set('');

        // Name validation
        const nameValue = this.name().trim();
        if (!nameValue) {
            this.nameError.set('Full name is required');
            isValid = false;
        } else if (nameValue.length < 2) {
            this.nameError.set('Name must be at least 2 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s'-]+$/.test(nameValue)) {
            this.nameError.set('Name can only contain letters, spaces, hyphens, and apostrophes');
            isValid = false;
        }

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
        } else if (passwordValue.length < 8) {
            this.passwordError.set('Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])/.test(passwordValue)) {
            this.passwordError.set('Password must contain at least one lowercase letter');
            isValid = false;
        } else if (!/(?=.*[A-Z])/.test(passwordValue)) {
            this.passwordError.set('Password must contain at least one uppercase letter');
            isValid = false;
        } else if (!/(?=.*\d)/.test(passwordValue)) {
            this.passwordError.set('Password must contain at least one number');
            isValid = false;
        }

        // Confirm password validation
        const confirmPasswordValue = this.confirmPassword();
        if (!confirmPasswordValue) {
            this.confirmPasswordError.set('Please confirm your password');
            isValid = false;
        } else if (passwordValue !== confirmPasswordValue) {
            this.confirmPasswordError.set('Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    isFormValid(): boolean {
        return this.name().trim().length >= 2 &&
            this.email().includes('@') &&
            this.password().length >= 8 &&
            this.password() === this.confirmPassword() &&
            this.passwordStrength().score >= 2;
    }

    async signUp() {
        if (!this.validateForm()) {
            return;
        }

        this.isLoading.set(true);

        try {
            const { error } = await this.supabaseService.signUpWithEmail({
                name: this.name().trim(),
                email: this.email().trim(),
                password: this.password(),
            });

            if (error) {
                this.handleSignUpError(error);
            } else {
                this.alertService.success(
                    'Account created successfully! Please check your email to verify your account before signing in.',
                    'Welcome to DayMatrix'
                );
                this.router.navigate(['/signin']);
            }
        } catch (err) {
            this.alertService.error('An unexpected error occurred. Please try again later.', 'Sign Up Failed');
        } finally {
            this.isLoading.set(false);
        }
    }

    async signUpWithGoogle() {
        this.isLoading.set(true);

        try {
            const { error } = await this.supabaseService.signUpWithGoogle();

            if (error) {
                this.alertService.error('Failed to sign up with Google. Please try again.', 'Google Sign Up Failed');
            }
            // Note: On success, user will be redirected by Supabase OAuth flow
        } catch (err) {
            this.alertService.error('An unexpected error occurred. Please try again.', 'Google Sign Up Failed');
        } finally {
            this.isLoading.set(false);
        }
    }

    private handleSignUpError(error: any) {
        const errorMessage = error.message?.toLowerCase() || '';

        if (errorMessage.includes('user already registered') || errorMessage.includes('email already exists')) {
            this.emailError.set('An account with this email already exists');
            this.alertService.warning('An account with this email already exists. Please sign in instead.', 'Account Exists');
        } else if (errorMessage.includes('password should be at least')) {
            this.passwordError.set('Password must be at least 6 characters long');
            this.alertService.error('Password must be at least 6 characters long.', 'Invalid Password');
        } else if (errorMessage.includes('invalid email')) {
            this.emailError.set('Please enter a valid email address');
            this.alertService.error('Please enter a valid email address.', 'Invalid Email');
        } else if (errorMessage.includes('weak password')) {
            this.passwordError.set('Password is too weak. Please choose a stronger password');
            this.alertService.error('Password is too weak. Please include uppercase, lowercase, numbers, and special characters.', 'Weak Password');
        } else if (errorMessage.includes('rate limit')) {
            this.alertService.warning('Too many attempts. Please wait a moment before trying again.', 'Rate Limited');
        } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            this.alertService.error('Network connection error. Please check your internet connection and try again.', 'Connection Error');
        } else {
            this.alertService.error('Unable to create account. Please try again later.', 'Sign Up Failed');
        }
    }
}
