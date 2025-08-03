import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <img src="/logo.svg" alt="DayMatrix Logo" class="auth-logo" />
        <h2 class="auth-title">Sign in to DayMatrix</h2>
        <form class="auth-form">
          <input type="email" name="email"  [(ngModel)]="email" placeholder="Email" class="auth-input" />
          <input type="password" name="password" [(ngModel)]="password" placeholder="Password" class="auth-input" />
          <button class="auth-primary" type="button" (click)="signInWithEmail()">Sign In</button>
        </form>
        <div class="auth-footer">
          <span>Don't have an account?</span>
          <a routerLink="/signup" class="auth-link">Sign Up</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  email = signal('');
  password = signal('');

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  constructor() { }

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const user = await this.supabaseService.isSignedIn();
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  async signInWithEmail() {
    const { error } = await this.supabaseService.signInWithEmail({
      email: this.email(),
      password: this.password(),
    });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        this.alertService.error('Invalid email or password. Please check your credentials.', 'Sign In Failed');
      } else if (error.message.includes('Email not confirmed')) {
        this.alertService.warning('Please check your email and confirm your account first.', 'Email Confirmation Required');
      } else {
        this.alertService.error('Unable to sign in. Please try again later.', 'Sign In Failed');
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
