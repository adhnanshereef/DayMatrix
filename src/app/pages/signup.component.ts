import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

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
                alert('Error signing up: ' + error.message);
            }
        } else {
            if (typeof window !== 'undefined') {
                alert('Check your email to confirm your account!');
                this.router.navigate(['/signin']);
            }
        }
    }
}
