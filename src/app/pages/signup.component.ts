import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-signup',
    imports: [RouterLink, FormsModule],
    template: `
    <div class="auth-page">
      <div class="auth-card">
        <img src="/logo.svg" alt="DayMatrix Logo" class="auth-logo" />
        <h2 class="auth-title">Create your account</h2>
        <form class="auth-form">
          <input type="text" name="name" placeholder="Full Name" [(ngModel)]="name" class="auth-input" />
          <input type="email" name="email" placeholder="Email" [(ngModel)]="email" class="auth-input" />
          <input type="password" name="password" placeholder="Password" [(ngModel)]="password" class="auth-input" />
          <button class="auth-primary" (click)="signUp()" type="button">Sign Up</button>
        </form>
        <div class="auth-footer">
          <span>Already have an account?</span>
          <a routerLink="/signin" class="auth-link">Sign In</a>
        </div>
      </div>
    </div>
  `,
    styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
    name = signal('');
    email = signal('');
    password = signal('');

    private readonly supabaseService = inject(SupabaseService);
    private readonly router = inject(Router);
    private readonly alertService = inject(AlertService);

    async ngOnInit() {
        if (typeof window !== 'undefined') {
            const user = await this.supabaseService.isSignedIn();
            if (user) {
                this.router.navigate(['/dashboard']);
            }
        }
    }

    async signUp() {
        if (typeof window === 'undefined') return; // SSR safety check

        const { error } = await this.supabaseService.signUpWithEmail({
            name: this.name(),
            email: this.email(),
            password: this.password(),
        });
        if (error) {
            // Avoid alert in SSR
            if (typeof window !== 'undefined') {
                if (error.message.includes('User already registered')) {
                    this.alertService.warning('An account with this email already exists. Please sign in instead.', 'Account Exists');
                } else if (error.message.includes('Password should be at least')) {
                    this.alertService.error('Password must be at least 6 characters long.', 'Invalid Password');
                } else if (error.message.includes('Invalid email')) {
                    this.alertService.error('Please enter a valid email address.', 'Invalid Email');
                } else {
                    this.alertService.error('Unable to create account. Please try again later.', 'Sign Up Failed');
                }
            }
        } else {
            if (typeof window !== 'undefined') {
                this.alertService.success('Account created! Please check your email to verify your account.', 'Welcome to DayMatrix');
                this.router.navigate(['/signin']);
            }
        }
    }
}
