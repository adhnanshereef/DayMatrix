import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p>Dashboard content coming soon...</p>
      @if(user){
        <p>Welcome, {{ user.user_metadata['displayName'] }}</p>
        <p>Your email: {{ user.email }}</p>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 120px 20px 40px;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--text-color);
    }
  `]
})
export class DashboardComponent implements OnInit{
  user: User | null = null;

  
  private readonly supabaseService = inject(SupabaseService);
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.supabaseService.getUser().then(({ data, error }) => {
        if (error) {
          console.error('Error fetching user:', error);
        } else {
          this.user = data.user;
        }
      });
    }
  }
}
