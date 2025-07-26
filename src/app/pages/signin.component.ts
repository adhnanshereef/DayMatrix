import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';

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
export class SigninComponent implements OnInit  {
    email = signal('');
  password = signal('');

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  constructor() {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const user = await this.supabaseService.getUser();
      if (!user.error) {
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
      alert('Error signing in: ' + error.message);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
