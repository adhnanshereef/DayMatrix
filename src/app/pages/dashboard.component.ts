import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <!-- Background Gradient Shapes -->
      <div class="background-gradient-shapes">
        <div class="gradient-oval gradient-oval-1"></div>
        <div class="gradient-oval gradient-oval-2"></div>
        <div class="gradient-oval gradient-oval-3"></div>
      </div>

      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Welcome to your productivity command center</p>
        
        @if(user){
          <div class="user-welcome">
            <div class="welcome-card">
              <div class="welcome-content">
                <h2>Welcome back, {{ user.user_metadata['displayName'] || 'User' }}!</h2>
                <p>{{ user.email }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <div class="content-section">
          <h2>Dashboard Overview</h2>
          <p>Your personalized productivity dashboard is coming soon. This will include:</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                </svg>
              </div>
              <h3>Task Overview</h3>
              <p>Quick summary of your tasks across all quadrants</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3>Productivity Analytics</h3>
              <p>Track your progress and productivity trends</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 2v4"/>
                  <path d="M16 2v4"/>
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M3 10h18"/>
                </svg>
              </div>
              <h3>Calendar Integration</h3>
              <p>Sync your tasks with your calendar events</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Goal Tracking</h3>
              <p>Set and monitor your productivity goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Background Gradient Shapes */
    .background-gradient-shapes {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    .gradient-oval {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.08;
      animation: floatParticle 25s ease-in-out infinite;
    }

    :root[data-theme="light"] .gradient-oval {
      opacity: 0.04;
      filter: blur(150px);
    }

    .gradient-oval-1 {
      width: 400px;
      height: 300px;
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }

    .gradient-oval-2 {
      width: 350px;
      height: 450px;
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      top: 50%;
      right: -15%;
      animation-delay: -8s;
    }

    .gradient-oval-3 {
      width: 500px;
      height: 250px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      bottom: 20%;
      left: 20%;
      animation-delay: -16s;
    }

    @keyframes floatParticle {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    .page-container {
      padding: 120px 20px 40px;
      max-width: 1400px;
      margin: 0 auto;
      color: var(--text-color);
      position: relative;
      z-index: 1;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .dashboard-title {
      font-size: 3.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .dashboard-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .user-welcome {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .welcome-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .welcome-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
    }

    :root[data-theme="light"] .welcome-card {
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(28, 95, 120, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }

    .welcome-content h2 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .welcome-content p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .dashboard-content {
      margin-top: 3rem;
    }

    .content-section {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 2.5rem;
    }

    :root[data-theme="light"] .content-section {
      background: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(28, 95, 120, 0.15);
    }

    .content-section h2 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .content-section > p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .feature-card:hover::before {
      opacity: 0.05;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: rgba(255, 255, 255, 0.15);
    }

    :root[data-theme="light"] .feature-card {
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid rgba(28, 95, 120, 0.1);
    }

    :root[data-theme="light"] .feature-card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .feature-card h3 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 2.5rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .content-section {
        padding: 1.5rem;
      }
      
      .page-container {
        padding: 100px 16px 40px;
      }

      .welcome-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-title {
        font-size: 2rem;
      }

      .content-section h2 {
        font-size: 1.5rem;
      }

      .feature-card {
        padding: 1.25rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit{
  user: User | null = null;

  private readonly supabaseService = inject(SupabaseService);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.supabaseService.user$.subscribe(user => {
        this.user = user;
      });
    }
  }
}
