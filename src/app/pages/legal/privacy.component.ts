import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Section {
  id: string;
  title: string;
  content: string[];
  subsections?: { title: string; content: string[] }[];
}

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  template: `
    <div class="legal-page">
      <!-- Background Gradient Shapes -->
      <div class="background-gradient-shapes">
        <div class="gradient-oval gradient-oval-1"></div>
        <div class="gradient-oval gradient-oval-2"></div>
        <div class="gradient-oval gradient-oval-3"></div>
        <div class="gradient-oval gradient-oval-4"></div>
        <div class="gradient-oval gradient-oval-5"></div>
      </div>

      <!-- Legal Hero Section -->
      <section class="legal-hero-section">
        <div class="torch-light torch-hero-primary"></div>
        <div class="torch-light torch-hero-secondary"></div>
        <div class="floating-particles"></div>
        
        <div class="legal-hero-content">
          <div class="breadcrumb-nav">
            <nav class="breadcrumb-container">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a routerLink="/" class="breadcrumb-link">
                    <svg class="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    Home
                  </a>
                </li>
                <li class="breadcrumb-separator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </li>
                <li class="breadcrumb-item active">Privacy Policy</li>
              </ol>
            </nav>
          </div>
          
          <div class="legal-header">
            <div class="legal-badge">
              <span class="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              Privacy & Data Protection
            </div>
            
            <h1 class="legal-title">
              Privacy <span class="gradient-text">Policy</span>
            </h1>
            
            <p class="legal-subtitle">
              Your privacy and data security are fundamental rights. Learn how DayMatrix protects, 
              processes, and manages your personal information in compliance with Indian data protection laws.
            </p>
            
            <div class="legal-meta">
              <div class="meta-item">
                <span class="meta-label">Last Updated:</span>
                <span class="meta-value">{{ lastUpdated() }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Effective Date:</span>
                <span class="meta-value">{{ effectiveDate() }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Compliance:</span>
                <span class="meta-value">IT Act 2000, GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy Commitment Banner -->
      <section class="privacy-commitment-section">
        <div class="torch-light torch-commitment-primary"></div>
        <div class="section-container">
          <div class="commitment-card glassmorphism-card">
            <div class="commitment-content">
              <div class="commitment-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div class="commitment-text">
                <h2 class="commitment-title">Our Privacy Commitment</h2>
                <p class="commitment-description">
                  We believe privacy is a fundamental right. DayMatrix is designed with privacy-first principles, 
                  ensuring your personal data is protected, your productivity insights remain private, 
                  and you maintain complete control over your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Table of Contents -->
      <section class="table-of-contents-section">
        <div class="torch-light torch-content-primary"></div>
        <div class="section-container">
          <div class="toc-card glassmorphism-card">
            <h2 class="toc-title">
              <svg class="toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3" y2="6"/>
                <line x1="3" y1="12" x2="3" y2="12"/>
                <line x1="3" y1="18" x2="3" y2="18"/>
              </svg>
              Table of Contents
            </h2>
            <nav class="toc-nav">
              <ul class="toc-list">
                @for (section of sections(); track section.id) {
                  <li class="toc-item">
                    <a [href]="'#' + section.id" class="toc-link" (click)="scrollToSection(section.id, $event)">
                      <span class="toc-number">{{ $index + 1 }}.</span>
                      {{ section.title }}
                    </a>
                  </li>
                }
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <!-- Legal Content Sections -->
      <section class="legal-content-section">
        <div class="torch-light torch-content-secondary"></div>
        <div class="section-container">
          @for (section of sections(); track section.id) {
            <div [id]="section.id" class="content-card glassmorphism-card">
              <div class="section-header">
                <h2 class="section-title">
                  <span class="section-number">{{ $index + 1 }}.</span>
                  {{ section.title }}
                </h2>
              </div>
              
              <div class="section-content">
                @for (paragraph of section.content; track $index) {
                  <p class="content-paragraph">{{ paragraph }}</p>
                }
                
                @if (section.subsections) {
                  @for (subsection of section.subsections; track $index) {
                    <div class="subsection">
                      <h3 class="subsection-title">{{ subsection.title }}</h3>
                      @for (paragraph of subsection.content; track $index) {
                        <p class="content-paragraph">{{ paragraph }}</p>
                      }
                    </div>
                  }
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Data Rights Section -->
      <section class="data-rights-section">
        <div class="torch-light torch-rights-primary"></div>
        <div class="section-container">
          <div class="rights-card glassmorphism-card">
            <div class="rights-header">
              <h2 class="rights-title">
                <svg class="rights-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 1.2-.4 2.3-1.1 3.1l-1.6-1.6c.4-.5.7-1.2.7-1.9 0-.6-.2-1.2-.7-1.7L21 12z"/>
                  <path d="M3 12c0-1.2.4-2.3 1.1-3.1l1.6 1.6c-.4.5-.7 1.2-.7 1.9 0 .6.2 1.2.7 1.7L3 12z"/>
                </svg>
                Your Data Rights
              </h2>
              <p class="rights-subtitle">
                You have comprehensive rights regarding your personal data. Here's what you can do:
              </p>
            </div>
            
            <div class="rights-grid">
              <div class="right-item">
                <div class="right-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <h3 class="right-title">Access Your Data</h3>
                <p class="right-description">Request a copy of all personal data we hold about you</p>
              </div>
              
              <div class="right-item">
                <div class="right-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <h3 class="right-title">Correct Information</h3>
                <p class="right-description">Update or correct any inaccurate personal information</p>
              </div>
              
              <div class="right-item">
                <div class="right-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </div>
                <h3 class="right-title">Delete Your Data</h3>
                <p class="right-description">Request deletion of your personal data (right to be forgotten)</p>
              </div>
              
              <div class="right-item">
                <div class="right-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 17l5-5-5-5"/>
                    <path d="M21 12H9"/>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  </svg>
                </div>
                <h3 class="right-title">Data Portability</h3>
                <p class="right-description">Export your data in a structured, machine-readable format</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="contact-section">
        <div class="torch-light torch-contact-primary"></div>
        <div class="section-container">
          <div class="contact-card glassmorphism-card">
            <div class="contact-header">
              <h2 class="contact-title">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Privacy Contact Information
              </h2>
              <p class="contact-subtitle">
                Have privacy concerns or data requests? Contact our privacy team for assistance.
              </p>
            </div>
            
            <div class="contact-grid">
              <div class="contact-item">
                <div class="contact-item-header">
                  <svg class="contact-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span class="contact-item-label">Privacy Email</span>
                </div>
                <a href="mailto:day.contact&#64;adhnan.tech" class="contact-item-value">
                  day.contact&#64;adhnan.tech
                </a>
              </div>
              
              <div class="contact-item">
                <div class="contact-item-header">
                  <svg class="contact-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span class="contact-item-label">CEO & Developer</span>
                </div>
                <span class="contact-item-value">Adhnan Shereef T</span>
              </div>
              
              <div class="contact-item">
                <div class="contact-item-header">
                  <svg class="contact-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <span class="contact-item-label">Website</span>
                </div>
                <a href="https://www.adhnan.tech" target="_blank" rel="noopener noreferrer" class="contact-item-value">
                  www.adhnan.tech
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Legal Navigation -->
      <section class="legal-navigation-section">
        <div class="section-container">
          <div class="legal-nav-card glassmorphism-card">
            <div class="legal-nav-content">
              <div class="legal-nav-item">
                <h3 class="legal-nav-title">Terms of Service</h3>
                <p class="legal-nav-description">Read our complete terms and conditions</p>
                <a routerLink="/terms" class="legal-nav-link">
                  View Terms of Service
                  <svg class="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="legal-nav-divider"></div>
              
              <div class="legal-nav-item">
                <h3 class="legal-nav-title">Back to DayMatrix</h3>
                <p class="legal-nav-description">Return to your productivity dashboard</p>
                <a routerLink="/dashboard" class="legal-nav-link">
                  Go to Dashboard
                  <svg class="nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './legal.component.css'
})
export class PrivacyComponent implements OnInit, OnDestroy {
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  lastUpdated = signal('August 3, 2025');
  effectiveDate = signal('August 3, 2025');

  sections = signal<Section[]>([
    {
      id: 'introduction',
      title: 'Introduction and Scope',
      content: [
        'This Privacy Policy explains how DayMatrix ("we," "our," or "us") collects, uses, processes, and protects your personal information when you use our productivity and task management service. This policy applies to all users of DayMatrix, regardless of location.',
        'We are committed to protecting your privacy and ensuring transparency in our data practices. This policy is designed to comply with applicable data protection laws, including the Information Technology Act, 2000 of India, and incorporates principles from international frameworks like GDPR.',
        'By using DayMatrix, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein.'
      ]
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: [
        'We collect information that you provide directly to us, information that we collect automatically when you use our service, and information from third-party sources when you choose to connect external services.'
      ],
      subsections: [
        {
          title: 'Information You Provide',
          content: [
            'Account Information: Name, email address, password, and profile preferences when you create an account.',
            'Task and Productivity Data: Tasks, priorities, categories, deadlines, and productivity metrics you input into the system.',
            'Communication Data: Messages, feedback, and support requests you send to us.',
            'Payment Information: Billing details and payment method information processed through secure third-party payment processors.'
          ]
        },
        {
          title: 'Automatically Collected Information',
          content: [
            'Usage Analytics: How you interact with our service, features used, time spent, and productivity patterns.',
            'Device Information: IP address, browser type, operating system, device identifiers, and technical specifications.',
            'Log Data: Server logs, error reports, and performance metrics for service improvement and security.',
            'Cookies and Tracking: Session cookies, preference cookies, and analytics cookies as detailed in our Cookie Policy.'
          ]
        },
        {
          title: 'Third-Party Information',
          content: [
            'Social Authentication: Profile information from Google, GitHub, or other OAuth providers you choose to use.',
            'Calendar Integration: Calendar events and schedules when you connect external calendar services.',
            'Third-Party Tools: Data from productivity tools and services you choose to integrate with DayMatrix.'
          ]
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      content: [
        'We use your personal information for specific, legitimate purposes that directly relate to providing and improving our productivity service. Our use of data is guided by principles of necessity, proportionality, and user benefit.'
      ],
      subsections: [
        {
          title: 'Service Provision',
          content: [
            'Account Management: Creating, maintaining, and securing your user account.',
            'Core Functionality: Enabling task management, priority setting, and productivity tracking features.',
            'Personalization: Customizing your experience based on preferences and usage patterns.',
            'Synchronization: Syncing your data across devices and platforms you use.'
          ]
        },
        {
          title: 'Service Improvement',
          content: [
            'Analytics and Insights: Understanding usage patterns to improve features and user experience.',
            'Performance Optimization: Monitoring and improving service speed, reliability, and effectiveness.',
            'Feature Development: Developing new features based on user needs and feedback.',
            'Bug Fixing: Identifying and resolving technical issues and service interruptions.'
          ]
        },
        {
          title: 'Communication and Support',
          content: [
            'Customer Support: Responding to inquiries, providing assistance, and resolving issues.',
            'Service Updates: Notifying you about important changes, updates, or security matters.',
            'Marketing Communications: Sending relevant product updates and tips (with your consent).',
            'Legal Compliance: Fulfilling legal obligations and responding to lawful requests.'
          ]
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing and Disclosure',
      content: [
        'We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information only in specific circumstances as outlined below, and always with appropriate safeguards.'
      ],
      subsections: [
        {
          title: 'Service Providers',
          content: [
            'Cloud Infrastructure: Hosting providers and cloud services that store and process your data securely.',
            'Payment Processors: Secure payment handling services for subscription and billing management.',
            'Analytics Services: Privacy-focused analytics tools that help us understand service usage.',
            'Communication Tools: Email and messaging services for customer support and notifications.'
          ]
        },
        {
          title: 'Legal Requirements',
          content: [
            'Legal Compliance: When required by applicable law, regulation, or court order.',
            'Safety and Security: To protect our rights, property, or safety, or that of our users or others.',
            'Fraud Prevention: To investigate, prevent, or take action regarding suspected fraud or illegal activities.',
            'Business Transfers: In connection with mergers, acquisitions, or sale of assets (with user notification).'
          ]
        },
        {
          title: 'User-Directed Sharing',
          content: [
            'Team Features: Data shared with team members when you use collaborative features.',
            'Integrations: Information shared with third-party services you choose to connect.',
            'Public Content: Any information you choose to make public through our service.'
          ]
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security and Protection',
      content: [
        'We implement comprehensive security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security practices are regularly reviewed and updated to address emerging threats.',
        'Data is encrypted in transit using industry-standard TLS encryption and at rest using AES-256 encryption. Access to personal data is restricted to authorized personnel who need it to perform their job functions.',
        'We conduct regular security audits, vulnerability assessments, and penetration testing to ensure the ongoing security of our systems and your data.'
      ],
      subsections: [
        {
          title: 'Technical Safeguards',
          content: [
            'Encryption: End-to-end encryption for data transmission and strong encryption for data storage.',
            'Access Controls: Multi-factor authentication, role-based access, and principle of least privilege.',
            'Network Security: Firewalls, intrusion detection systems, and secure network architecture.',
            'Data Backup: Regular, encrypted backups with secure off-site storage and tested recovery procedures.'
          ]
        },
        {
          title: 'Organizational Measures',
          content: [
            'Staff Training: Regular privacy and security training for all personnel with data access.',
            'Privacy by Design: Incorporating privacy considerations into all system design and development.',
            'Incident Response: Comprehensive procedures for detecting, responding to, and reporting security incidents.',
            'Vendor Management: Due diligence and contractual protections for all third-party service providers.'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention and Deletion',
      content: [
        'We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.',
        'Account data is retained while your account is active and for a period of 30 days after account deletion to allow for account recovery. After this period, personal data is permanently deleted from our systems.',
        'Some information may be retained for longer periods where required by law or for legitimate business purposes such as fraud prevention, but always with appropriate safeguards.'
      ],
      subsections: [
        {
          title: 'Retention Periods',
          content: [
            'Active Account Data: Retained while your account remains active and you continue to use our service.',
            'Deleted Account Data: 30-day grace period for account recovery, then permanent deletion.',
            'Support Communications: Retained for 3 years to maintain support history and improve service quality.',
            'Legal and Compliance: Retained as required by applicable laws and regulations.'
          ]
        },
        {
          title: 'Deletion Procedures',
          content: [
            'User-Initiated Deletion: You can delete your account and data at any time through your account settings.',
            'Automatic Deletion: Systems automatically delete data according to our retention schedules.',
            'Secure Deletion: Data is securely overwritten and cannot be recovered once deletion is complete.',
            'Backup Deletion: Data is also removed from backup systems according to our backup retention policy.'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      content: [
        'You have comprehensive rights regarding your personal data. We provide easy-to-use tools and processes for exercising these rights, and we respond to all requests promptly and without charge.',
        'You can exercise most of these rights directly through your account settings. For more complex requests, you can contact our privacy team using the information provided in this policy.'
      ],
      subsections: [
        {
          title: 'Access and Portability',
          content: [
            'Data Access: Request a copy of all personal data we hold about you in a readable format.',
            'Data Portability: Export your data in structured, machine-readable formats for transfer to other services.',
            'Account Information: View and download your account information, settings, and preferences.',
            'Usage Reports: Access reports about your service usage and data processing activities.'
          ]
        },
        {
          title: 'Correction and Control',
          content: [
            'Data Correction: Update, correct, or modify any inaccurate or incomplete personal information.',
            'Privacy Settings: Control how your data is used for analytics, marketing, and service improvement.',
            'Communication Preferences: Choose what communications you receive and how you receive them.',
            'Integration Controls: Manage connections to third-party services and data sharing preferences.'
          ]
        },
        {
          title: 'Deletion and Restriction',
          content: [
            'Account Deletion: Delete your account and all associated personal data permanently.',
            'Selective Deletion: Delete specific types of data while maintaining your account.',
            'Processing Restriction: Limit how we process your data in certain circumstances.',
            'Objection Rights: Object to certain types of data processing, particularly for marketing purposes.'
          ]
        }
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to provide, protect, and improve our service. Cookies are small text files stored on your device that help us remember your preferences and understand how you use our service.',
        'You can control cookie settings through your browser preferences, but disabling certain cookies may affect service functionality. We respect "Do Not Track" signals and provide granular privacy controls.'
      ],
      subsections: [
        {
          title: 'Types of Cookies',
          content: [
            'Essential Cookies: Required for basic service functionality, security, and user authentication.',
            'Preference Cookies: Remember your settings, preferences, and customization choices.',
            'Analytics Cookies: Help us understand service usage and improve user experience (anonymized).',
            'Marketing Cookies: Used for relevant advertising and marketing communications (with consent).'
          ]
        },
        {
          title: 'Cookie Management',
          content: [
            'Browser Controls: Manage cookies through your browser settings and preferences.',
            'Privacy Dashboard: Control cookie preferences through your account privacy settings.',
            'Opt-Out Options: Easy opt-out mechanisms for non-essential cookies and tracking.',
            'Third-Party Cookies: Information about cookies set by integrated third-party services.'
          ]
        }
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      content: [
        'DayMatrix may transfer, store, and process your personal information in countries other than your country of residence. We ensure that all international data transfers are protected by appropriate safeguards.',
        'When we transfer data internationally, we use standard contractual clauses, adequacy decisions, or other lawful transfer mechanisms to ensure your data receives adequate protection.',
        'You have the right to obtain information about the safeguards we use for international transfers and to request copies of relevant documentation.'
      ]
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy Protection',
      content: [
        'DayMatrix is not intended for use by children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children under these ages.',
        'If we become aware that we have collected personal information from a child under the applicable age limit, we will take immediate steps to delete that information from our systems.',
        'Parents and guardians who believe their child has provided personal information to us should contact us immediately using the information provided in this policy.'
      ]
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes through email or prominent notice in our service.',
        'The "Last Updated" date at the top of this policy indicates when the most recent changes were made. We encourage you to review this policy periodically to stay informed about how we protect your information.',
        'Your continued use of DayMatrix after policy changes constitutes acceptance of the updated policy. If you disagree with changes, you may delete your account before the changes take effect.'
      ]
    },
    {
      id: 'legal-basis',
      title: 'Legal Basis for Processing',
      content: [
        'We process your personal information based on several legal grounds, depending on how you interact with our service and the specific data involved.',
        'Understanding the legal basis for processing helps you understand your rights and our obligations regarding your personal data.',
        'We regularly review our processing activities to ensure they remain lawful, fair, and transparent.'
      ],
      subsections: [
        {
          title: 'Contractual Necessity',
          content: [
            'Account Management: Processing necessary to create and maintain your account.',
            'Service Provision: Data processing required to deliver the core DayMatrix service.',
            'Payment Processing: Processing necessary to handle subscriptions and billing.',
            'Technical Support: Data processing required to provide customer support and resolve issues.'
          ]
        },
        {
          title: 'Legitimate Interests',
          content: [
            'Service Improvement: Analytics and research to enhance user experience and functionality.',
            'Security Measures: Processing necessary to protect against fraud, abuse, and security threats.',
            'Business Operations: Administrative processing for business management and operations.',
            'Legal Compliance: Processing required to comply with legal obligations and regulatory requirements.'
          ]
        },
        {
          title: 'User Consent',
          content: [
            'Marketing Communications: Promotional emails and product updates (where consent is required).',
            'Optional Features: Advanced analytics and personalization features you choose to enable.',
            'Third-Party Integrations: Connecting external services and applications to your account.',
            'Research Participation: Voluntary participation in user research and feedback programs.'
          ]
        }
      ]
    }
  ]);

  constructor() {}

  ngOnInit() {
    // Update SEO for privacy page
    this.seoService.updateCustomSEO({
      title: 'Privacy Policy - DayMatrix | Data Protection and Privacy Rights',
      description: 'Learn how DayMatrix protects your personal data and respects your privacy. Comprehensive privacy policy covering data collection, usage, security, and your rights under Indian and international law.',
      keywords: 'DayMatrix privacy policy, data protection, privacy rights, personal data security, GDPR compliance, Indian privacy law, data usage, user rights, information security',
      url: 'https://daymatrix.app/privacy',
      type: 'website'
    });

    if (this.isBrowser) {
      // Initialize any browser-specific functionality
      this.initializeSmoothScrolling();
    }
  }

  ngOnDestroy() {
    // Clean up any subscriptions or browser-specific functionality
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without page jump
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  }

  private initializeSmoothScrolling() {
    // Add smooth scrolling behavior for any additional interactions
    if (this.isBrowser) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }
}
