import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { SeoService } from '../../services/seo.service';

interface Feature {
  title: string;
  description: string;
  icon: string;
  highlighted?: boolean;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  productivity_gain: string;
}

interface MatrixPrinciple {
  title: string;
  description: string;
  quadrant: string;
  actionVerb: string;
  examples: string[];
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <!-- Background Gradient Shapes -->
      <div class="background-gradient-shapes">
        <div class="gradient-oval gradient-oval-1"></div>
        <div class="gradient-oval gradient-oval-2"></div>
        <div class="gradient-oval gradient-oval-3"></div>
        <div class="gradient-oval gradient-oval-4"></div>
        <div class="gradient-oval gradient-oval-5"></div>
      </div>

      <!-- Hero Section with Strategic Torch Lighting -->
      <section class="hero-section">
        <div class="torch-light torch-hero-primary"></div>
        <div class="torch-light torch-hero-secondary"></div>
        <div class="floating-particles"></div>
        
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <span class="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </span>
              Eisenhower Matrix Methodology
            </div>
            
            <h1 class="hero-title" itemprop="headline">
              Master Productivity with the
              <span class="gradient-text">Eisenhower Matrix</span>
            </h1>
            
            <p class="hero-subtitle" itemprop="description">
              Transform decision paralysis into decisive action. DayMatrix implements President Eisenhower's proven decision-making framework, helping you distinguish between urgent and important tasks to achieve peak productivity and strategic focus.
            </p>
            
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number" [attr.data-target]="12847">0</div>
                <div class="stat-label">Active Users</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" [attr.data-target]="89">0%</div>
                <div class="stat-label">Productivity Increase</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" [attr.data-target]="156">0</div>
                <div class="stat-label">Minutes Saved Daily</div>
              </div>
            </div>
            
            <div class="hero-actions">
              <button class="primary-button" routerLink="/dashboard" (click)="trackAction('start_now')">
                <span class="button-content">
                  <span class="button-text">Start Organizing Now</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </span>
              </button>
              <button class="secondary-button" (click)="scrollToMatrix()">
                <span class="button-content">
                  <span class="button-text">Discover the Method</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="matrix-showcase">
              <div class="matrix-3d-container" 
                   (mouseenter)="setMatrixHovered(true)"
                   (mouseleave)="setMatrixHovered(false)">
                <div class="matrix-grid" [class.matrix-hovered]="isMatrixHovered()">
                  @for (quadrant of matrixQuadrants(); track quadrant.quadrant) {
                    <div class="matrix-quadrant" 
                         [class]="quadrant.quadrant"
                         [class.highlighted]="highlightedQuadrant() === quadrant.quadrant"
                         (mouseenter)="setHighlightedQuadrant(quadrant.quadrant)"
                         (mouseleave)="setHighlightedQuadrant(null)">
                      <div class="quadrant-header">
                        <div class="quadrant-number">{{ getQuadrantNumber(quadrant.quadrant) }}</div>
                        <div class="quadrant-action">{{ quadrant.actionVerb }}</div>
                      </div>
                      <div class="quadrant-title">{{ quadrant.title }}</div>
                      <div class="quadrant-description">{{ quadrant.description }}</div>
                      <div class="sample-tasks">
                        @for (example of quadrant.examples; track example) {
                          <div class="sample-task">{{ example }}</div>
                        }
                      </div>
                      <div class="quadrant-glow"></div>
                    </div>
                  }
                </div>
                
                <!-- 3D Matrix Labels -->
                <div class="matrix-labels">
                  <div class="axis-label urgent-axis">Urgent</div>
                  <div class="axis-label not-urgent-axis">Not Urgent</div>
                  <div class="axis-label important-axis">Important</div>
                  <div class="axis-label not-important-axis">Not Important</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Eisenhower Biography Section -->
      <section class="biography-section" id="about-eisenhower">
        <div class="torch-light torch-bio"></div>
        <div class="section-container">
          <div class="biography-content">
            <div class="biography-image">
              <div class="image-frame">
                <div class="president-silhouette"></div>
              </div>
            </div>
            <div class="biography-text">
              <h2 class="section-title">The Eisenhower Legacy</h2>
              <div class="quote-block">
                <blockquote>
                  "What is important is seldom urgent and what is urgent is seldom important."
                </blockquote>
                <cite>— President Dwight D. Eisenhower</cite>
              </div>
              <p class="biography-description">
                President Dwight D. Eisenhower, the 34th President of the United States and Supreme Allied Commander in Europe during World War II, developed this decision-making framework to manage his overwhelming responsibilities. The Eisenhower Matrix, also known as the Priority Matrix, helped him lead one of history's most complex military operations and later govern a nation.
              </p>
              <div class="method-stats">
                <div class="method-stat">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div class="stat-content">
                    <div class="stat-title">Used by Leaders Worldwide</div>
                    <div class="stat-desc">CEOs, Military Officers, Entrepreneurs</div>
                  </div>
                </div>
                <div class="method-stat">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div class="stat-content">
                    <div class="stat-title">70+ Years Proven</div>
                    <div class="stat-desc">Time-tested decision framework</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Matrix Deep Dive Section -->
      <section class="matrix-deep-dive" id="matrix-method">
        <div class="torch-light torch-matrix-left"></div>
        <div class="torch-light torch-matrix-right"></div>
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">The Four Quadrants Explained</h2>
            <p class="section-subtitle">
              Master the art of prioritization by understanding each quadrant's strategic purpose and optimal approach.
            </p>
          </div>
          
          <div class="quadrants-explanation">
            @for (principle of matrixPrinciples(); track principle.quadrant) {
              <div class="principle-card" [class]="principle.quadrant + '-card'">
                <div class="principle-header">
                  <div class="principle-number">{{ getQuadrantNumber(principle.quadrant) }}</div>
                  <div class="principle-action">{{ principle.actionVerb }}</div>
                </div>
                <h3 class="principle-title">{{ principle.title }}</h3>
                <p class="principle-description">{{ principle.description }}</p>
                <div class="principle-examples">
                  <h4>Typical Tasks:</h4>
                  <ul>
                    @for (example of principle.examples; track example) {
                      <li>{{ example }}</li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="torch-light torch-features"></div>
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Powerful Implementation</h2>
            <p class="section-subtitle">
              Everything you need to implement the Eisenhower Matrix methodology in your daily workflow.
            </p>
          </div>
          
          <div class="features-grid">
            @for (feature of features(); track feature.title; let i = $index) {
              <div class="feature-card">
                <div class="feature-content">
                  <h3 class="feature-title">{{ feature.title }}</h3>
                  <p class="feature-description">{{ feature.description }}</p>
                </div>
                <div class="feature-visual">
                  <div class="feature-icon-3d" [attr.data-icon]="feature.icon">
                    @switch (feature.icon) {
                      @case ('brain') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                          <path d="M8 12h8"/>
                          <path d="M12 8v8"/>
                          <circle cx="8" cy="8" r="1"/>
                          <circle cx="16" cy="8" r="1"/>
                          <circle cx="8" cy="16" r="1"/>
                          <circle cx="16" cy="16" r="1"/>
                        </svg>
                      }
                      @case ('calendar') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                          <path d="M8 14h.01"/>
                          <path d="M12 14h.01"/>
                          <path d="M16 14h.01"/>
                          <path d="M8 18h.01"/>
                          <path d="M12 18h.01"/>
                        </svg>
                      }
                      @case ('analytics') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <line x1="18" y1="20" x2="18" y2="10"/>
                          <line x1="12" y1="20" x2="12" y2="4"/>
                          <line x1="6" y1="20" x2="6" y2="14"/>
                          <circle cx="18" cy="8" r="2"/>
                          <circle cx="12" cy="2" r="2"/>
                          <circle cx="6" cy="12" r="2"/>
                        </svg>
                      }
                      @case ('delegate') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          <polyline points="22,12 18,8 14,12"/>
                          <line x1="18" y1="8" x2="18" y2="16"/>
                        </svg>
                      }
                      @case ('eliminate') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M4.93 4.93l14.14 14.14"/>
                          <path d="M8 12h8"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      }
                      @case ('sync') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M21.5 2v6h-6"/>
                          <path d="M21 11.5A9 9 0 0 0 3 7l18-5z"/>
                          <path d="M2.5 22v-6h6"/>
                          <path d="M3 12.5a9 9 0 0 0 18 4.5l-18 5z"/>
                          <circle cx="12" cy="12" r="1"/>
                        </svg>
                      }
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="torch-light torch-testimonials"></div>
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Real Results from Real Users</h2>
            <p class="section-subtitle">
              Discover how professionals are transforming their productivity with the Eisenhower Matrix.
            </p>
          </div>
          
          <div class="testimonials-grid">
            @for (testimonial of testimonials(); track testimonial.name) {
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <div class="quote-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                    </svg>
                  </div>
                  <p class="testimonial-text">{{ testimonial.content }}</p>
                  <div class="testimonial-stats">
                    <div class="productivity-gain">{{ testimonial.productivity_gain }}</div>
                    <div class="gain-label">Productivity Increase</div>
                  </div>
                </div>
                <div class="testimonial-author">
                  <div class="author-info">
                    <div class="author-name">{{ testimonial.name }}</div>
                    <div class="author-role">{{ testimonial.role }}</div>
                    <div class="author-company">{{ testimonial.company }}</div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="torch-light torch-cta-primary"></div>
        <div class="torch-light torch-cta-secondary"></div>
        <div class="cta-container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Master the Eisenhower Matrix?</h2>
            <p class="cta-subtitle">
              Join thousands of professionals who have revolutionized their decision-making and productivity using President Eisenhower's proven methodology.
            </p>
            <div class="cta-actions">
              <button class="cta-primary" routerLink="/dashboard">
                <span class="button-content">
                  <span class="button-text">Start Your Transformation</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </span>
              </button>
              <button class="cta-secondary" routerLink="/signup">
                <span class="button-content">
                  <span class="button-text">Create Free Account</span>
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);
  private readonly seoService = inject(SeoService);

  protected readonly isMatrixHovered = signal(false);
  protected readonly highlightedQuadrant = signal<string | null>(null);

  protected readonly matrixQuadrants = signal<MatrixPrinciple[]>([
    {
      title: 'Crisis & Deadlines',
      description: 'Tasks requiring immediate attention with significant consequences',
      quadrant: 'urgent-important',
      actionVerb: 'DO FIRST',
      examples: ['Emergency client calls', 'Project deadlines today', 'Critical system failures', 'Medical emergencies']
    },
    {
      title: 'Strategic Planning',
      description: 'Important work that drives long-term success and growth',
      quadrant: 'not-urgent-important',
      actionVerb: 'SCHEDULE',
      examples: ['Strategic planning', 'Skill development', 'Relationship building', 'Health and exercise']
    },
    {
      title: 'Interruptions',
      description: 'Urgent requests that can often be handled by others',
      quadrant: 'urgent-not-important',
      actionVerb: 'DELEGATE',
      examples: ['Non-critical emails', 'Some phone calls', 'Certain meetings', 'Minor requests']
    },
    {
      title: 'Time Wasters',
      description: 'Activities that provide little value and should be minimized',
      quadrant: 'not-urgent-not-important',
      actionVerb: 'ELIMINATE',
      examples: ['Excessive social media', 'Mindless browsing', 'Gossip and drama', 'Unnecessary meetings']
    }
  ]);

  protected readonly matrixPrinciples = signal<MatrixPrinciple[]>([
    {
      title: 'Urgent & Important: Crisis Management',
      description: 'These are the fires you must put out immediately. While necessary, living here constantly leads to stress and burnout. The goal is to minimize time spent in this quadrant by better planning and prevention.',
      quadrant: 'urgent-important',
      actionVerb: 'DO FIRST',
      examples: [
        'Medical emergencies requiring immediate attention',
        'Critical system outages affecting operations',
        'Project deadlines due today with major consequences',
        'Crisis communication and damage control',
        'Emergency client issues threatening relationships'
      ]
    },
    {
      title: 'Important but Not Urgent: Strategic Excellence',
      description: 'This is where high performers spend most of their time. These activities prevent crises, build capabilities, and create long-term success. Investing here reduces Quadrant 1 emergencies.',
      quadrant: 'not-urgent-important',
      actionVerb: 'SCHEDULE',
      examples: [
        'Strategic planning and goal setting',
        'Professional development and skill building',
        'Building relationships and networking',
        'Regular exercise and health maintenance',
        'Process improvement and system optimization'
      ]
    },
    {
      title: 'Urgent but Not Important: The Delegation Zone',
      description: 'These tasks feel urgent but don\'t contribute significantly to your goals. They often benefit others more than you. Delegate when possible, or handle quickly to minimize disruption.',
      quadrant: 'urgent-not-important',
      actionVerb: 'DELEGATE',
      examples: [
        'Non-critical emails requiring quick responses',
        'Phone calls that could be handled by others',
        'Administrative tasks with tight deadlines',
        'Requests from colleagues for non-essential help',
        'Social obligations with immediate RSVPs'
      ]
    },
    {
      title: 'Neither Urgent nor Important: The Elimination Zone',
      description: 'These activities provide minimal value and distract from meaningful work. Be ruthless in eliminating them. They\'re often habits disguised as necessities.',
      quadrant: 'not-urgent-not-important',
      actionVerb: 'ELIMINATE',
      examples: [
        'Excessive social media scrolling',
        'Watching random YouTube videos',
        'Participating in office gossip',
        'Attending unnecessary meetings',
        'Mindless web browsing and news consumption'
      ]
    }
  ]);

  protected readonly features = signal<Feature[]>([
    {
      title: 'Intelligent Task Categorization',
      description: 'Automatically classify tasks into the four Eisenhower quadrants using smart algorithms and learn from your patterns.',
      icon: 'brain',
      highlighted: false
    },
    {
      title: 'Strategic Time Blocking',
      description: 'Schedule Quadrant 2 activities to prevent them from becoming Quadrant 1 crises with intelligent calendar integration.',
      icon: 'calendar',
      highlighted: false
    },
    {
      title: 'Decision Framework Analytics',
      description: 'Track your decision patterns and see how well you\'re implementing the Eisenhower methodology over time.',
      icon: 'analytics',
      highlighted: false
    },
    {
      title: 'Delegation Management',
      description: 'Efficiently delegate Quadrant 3 tasks with built-in follow-up systems and progress tracking.',
      icon: 'delegate',
      highlighted: false
    },
    {
      title: 'Elimination Insights',
      description: 'Identify and eliminate time-wasting activities with detailed analysis of your Quadrant 4 patterns.',
      icon: 'eliminate',
      highlighted: false
    },
    {
      title: 'Cross-Platform Synchronization',
      description: 'Access your prioritized tasks and decisions across all devices with real-time synchronization.',
      icon: 'sync',
      highlighted: false
    }
  ]);

  protected readonly testimonials = signal<Testimonial[]>([
    {
      name: 'Sarah Chen',
      role: 'VP of Operations',
      company: 'TechFlow Solutions',
      content: 'The Eisenhower Matrix transformed how I approach my workday. I\'m no longer constantly firefighting and can focus on strategic initiatives that actually move the company forward.',
      productivity_gain: '+67%'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Startup Founder',
      company: 'InnovateLab',
      content: 'As a founder, everything feels urgent. DayMatrix helped me distinguish between real priorities and mere distractions. My decision-making is now more strategic and less reactive.',
      productivity_gain: '+84%'
    },
    {
      name: 'Dr. Amanda Foster',
      role: 'Research Director',
      company: 'BioMed Institute',
      content: 'Managing multiple research projects was overwhelming until I started using the Eisenhower methodology. Now I can focus on important research while efficiently handling administrative tasks.',
      productivity_gain: '+59%'
    },
    {
      name: 'James Liu',
      role: 'Product Manager',
      company: 'Digital Dynamics',
      content: 'The framework helped me say no to urgent but unimportant requests, freeing up time for actual product strategy. My team\'s output quality has improved dramatically.',
      productivity_gain: '+73%'
    }
  ]);

  async ngOnInit() {
    // Update SEO for home page with comprehensive metadata
    this.seoService.updateCustomSEO({
      title: 'DayMatrix - Master Productivity with the Eisenhower Matrix | Task Prioritization App',
      description: 'Transform decision paralysis into decisive action with DayMatrix. Implement President Eisenhower\'s proven decision-making framework for peak productivity and strategic focus. Join 12,000+ active users achieving 89% productivity increases.',
      keywords: 'Eisenhower Matrix, productivity app, task prioritization, time management, decision making framework, task manager, productivity tool, urgent important matrix, project management, workflow optimization, President Eisenhower, decision paralysis, strategic focus, quadrant system, crisis management, strategic planning',
      url: 'https://daymatrix.app/',
      type: 'website'
    });

    this.initializeAnimations();
    this.startCounterAnimations();
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const isSignedIn = await this.supabaseService.isSignedIn();
      if (isSignedIn) {
        const user = this.supabaseService.user$.value;
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup any ongoing animations or observers
  }

  protected scrollToMatrix(): void {
    const element = document.getElementById('matrix-method');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  protected trackAction(action: string): void {
    // Analytics tracking
    console.log('User action:', action);
  }

  protected getQuadrantNumber(quadrant: string): string {
    const numbers: { [key: string]: string } = {
      'urgent-important': '01',
      'not-urgent-important': '02',
      'urgent-not-important': '03',
      'not-urgent-not-important': '04'
    };
    return numbers[quadrant] || '00';
  }

  protected setMatrixHovered(hovered: boolean): void {
    this.isMatrixHovered.set(hovered);
  }

  protected setHighlightedQuadrant(quadrant: string | null): void {
    this.highlightedQuadrant.set(quadrant);
  }

  private initializeAnimations(): void {
    // Initialize intersection observer for scroll animations
    if (typeof window !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      });

      // Observe elements that should animate on scroll
      setTimeout(() => {
        const elements = document.querySelectorAll('.feature-card, .testimonial-card, .principle-card');
        elements.forEach(el => observer.observe(el));
      }, 100);
    }
  }

  private startCounterAnimations(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0');
          this.animateCounter(counter as HTMLElement, target);
        });
      }, 1000);
    }
  }

  private animateCounter(element: HTMLElement, target: number): void {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString() + (element.textContent?.includes('%') ? '%' : '');
    }, 20);
  }
}
