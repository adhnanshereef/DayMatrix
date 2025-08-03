import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Transform Your 
              <span class="gradient-text">Productivity</span>
            </h1>
            <p class="hero-subtitle">
              Intelligent task prioritization meets elegant design. 
              Master your time with our advanced matrix-based system.
            </p>
            <div class="hero-actions">
              <button class="primary-button" routerLink="/dashboard">
                Get Started Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </button>
              <button class="secondary-button">
                Watch Demo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="matrix-container" 
                 (mouseenter)="setMatrixHovered(true)"
                 (mouseleave)="setMatrixHovered(false)">
              <div class="matrix-grid" [class.matrix-hovered]="isMatrixHovered()">
                <div class="matrix-quadrant urgent-important" 
                     [class.highlighted]="highlightedQuadrant() === 'urgent-important'"
                     (mouseenter)="setHighlightedQuadrant('urgent-important')"
                     (mouseleave)="setHighlightedQuadrant(null)">
                  <div class="quadrant-label">Do First</div>
                  <div class="quadrant-description">Urgent & Important</div>
                  <div class="sample-tasks">
                    <div class="sample-task">Crisis Management</div>
                    <div class="sample-task">Emergency Fixes</div>
                    <div class="sample-task">Deadline Tasks</div>
                  </div>
                </div>

                <div class="matrix-quadrant not-urgent-important"
                     [class.highlighted]="highlightedQuadrant() === 'not-urgent-important'"
                     (mouseenter)="setHighlightedQuadrant('not-urgent-important')"
                     (mouseleave)="setHighlightedQuadrant(null)">
                  <div class="quadrant-label">Schedule</div>
                  <div class="quadrant-description">Important, Not Urgent</div>
                  <div class="sample-tasks">
                    <div class="sample-task">Strategic Planning</div>
                    <div class="sample-task">Skill Development</div>
                    <div class="sample-task">Long-term Goals</div>
                  </div>
                </div>

                <div class="matrix-quadrant urgent-not-important"
                     [class.highlighted]="highlightedQuadrant() === 'urgent-not-important'"
                     (mouseenter)="setHighlightedQuadrant('urgent-not-important')"
                     (mouseleave)="setHighlightedQuadrant(null)">
                  <div class="quadrant-label">Delegate</div>
                  <div class="quadrant-description">Urgent, Not Important</div>
                  <div class="sample-tasks">
                    <div class="sample-task">Interruptions</div>
                    <div class="sample-task">Some Meetings</div>
                    <div class="sample-task">Phone Calls</div>
                  </div>
                </div>

                <div class="matrix-quadrant not-urgent-not-important"
                     [class.highlighted]="highlightedQuadrant() === 'not-urgent-not-important'"
                     (mouseenter)="setHighlightedQuadrant('not-urgent-not-important')"
                     (mouseleave)="setHighlightedQuadrant(null)">
                  <div class="quadrant-label">Eliminate</div>
                  <div class="quadrant-description">Neither Urgent nor Important</div>
                  <div class="sample-tasks">
                    <div class="sample-task">Time Wasters</div>
                    <div class="sample-task">Distractions</div>
                    <div class="sample-task">Busywork</div>
                  </div>
                </div>

                <!-- Axis Labels in Corners -->
                <div class="axis-label axis-urgent">Urgent</div>
                <div class="axis-label axis-not-urgent">Not Urgent</div>
                <div class="axis-label axis-important">Important</div>
                <div class="axis-label axis-not-important">Not Important</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="features-section">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Powerful Features</h2>
            <p class="section-subtitle">
              Everything you need to master your productivity and time management
            </p>
          </div>
          
          <div class="features-grid">
            @for (feature of features(); track feature.title) {
              <div class="feature-card" [class.feature-highlighted]="feature.highlighted">
                <div class="feature-icon">
                  @if (feature.title === 'Smart Task Prioritization') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  } @else if (feature.title === 'Time Tracking') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  } @else if (feature.title === 'Advanced Analytics') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.29,7 12,12 20.71,7"/>
                      <line x1="12" y1="22" x2="12" y2="12"/>
                    </svg>
                  } @else if (feature.title === 'Team Collaboration') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  } @else if (feature.title === 'Mobile Sync') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="7" y="4" width="10" height="16" rx="1"/>
                      <line x1="11" y1="1" x2="13" y2="1"/>
                      <line x1="11" y1="21" x2="13" y2="21"/>
                    </svg>
                  } @else if (feature.title === 'Customizable Workflows') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  }
                </div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Transform Your Productivity?</h2>
            <p class="cta-subtitle">
              Join thousands of professionals who have revolutionized their workflow
            </p>
            <div class="cta-actions">
              <button class="cta-primary" routerLink="/dashboard">
                Start Your Journey
              </button>
              <button class="cta-secondary" routerLink="/features">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected readonly isMatrixHovered = signal(false);
  protected readonly highlightedQuadrant = signal<string | null>(null);

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  constructor() { }

  async ngOnInit() {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const user = await this.supabaseService.isSignedIn();
      if (user) {
      this.router.navigate(['/dashboard']);
      }
    }
  }
  
  protected readonly features = signal([
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      title: 'Smart Task Prioritization',
      description: 'Automatically categorize and prioritize your tasks using our intelligent matrix system.',
      highlighted: false
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
      title: 'Time Tracking',
      description: 'Monitor how you spend your time and identify opportunities for improvement.',
      highlighted: false
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29,7 12,12 20.71,7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>',
      title: 'Advanced Analytics',
      description: 'Gain insights into your productivity patterns with detailed analytics and reports.',
      highlighted: false
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      title: 'Team Collaboration',
      description: 'Share tasks and collaborate seamlessly with your team members.',
      highlighted: false
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><smartphone x="7" y="4" width="10" height="16" rx="1"/><line x1="11" y1="1" x2="13" y2="1"/><line x1="11" y1="21" x2="13" y2="21"/></svg>',
      title: 'Mobile Sync',
      description: 'Access your tasks and productivity data anywhere with full mobile synchronization.',
      highlighted: false
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      title: 'Customizable Workflows',
      description: 'Tailor the system to match your unique workflow and productivity preferences.',
      highlighted: false
    }
  ]);
  
  protected setMatrixHovered(hovered: boolean): void {
    this.isMatrixHovered.set(hovered);
  }
  
  protected setHighlightedQuadrant(quadrant: string | null): void {
    this.highlightedQuadrant.set(quadrant);
  }
}
