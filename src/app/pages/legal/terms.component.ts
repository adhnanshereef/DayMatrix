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
  selector: 'app-terms',
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
                <li class="breadcrumb-item active">Terms of Service</li>
              </ol>
            </nav>
          </div>
          
          <div class="legal-header">
            <div class="legal-badge">
              <span class="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </span>
              Legal Document
            </div>
            
            <h1 class="legal-title">
              Terms of <span class="gradient-text">Service</span>
            </h1>
            
            <p class="legal-subtitle">
              Understanding your rights and responsibilities when using DayMatrix productivity platform. 
              These terms govern your use of our Eisenhower Matrix-based task management system.
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
                <span class="meta-label">Governing Law:</span>
                <span class="meta-value">Republic of India</span>
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
                Contact Information
              </h2>
              <p class="contact-subtitle">
                Questions about these terms? We're here to help you understand your rights and responsibilities.
              </p>
            </div>
            
            <div class="contact-grid">
              <div class="contact-item">
                <div class="contact-item-header">
                  <svg class="contact-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span class="contact-item-label">Email Support</span>
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
                  <span class="contact-item-label">Ceo & Developer</span>
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
                <h3 class="legal-nav-title">Privacy Policy</h3>
                <p class="legal-nav-description">Learn how we protect and handle your personal data</p>
                <a routerLink="/privacy" class="legal-nav-link">
                  View Privacy Policy
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
export class TermsComponent implements OnInit, OnDestroy {
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  lastUpdated = signal('August 3, 2025');
  effectiveDate = signal('August 3, 2025');

  sections = signal<Section[]>([
    {
      id: 'acceptance-of-terms',
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using DayMatrix ("the Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.',
        'These terms constitute a legally binding agreement between you and DayMatrix, governed by the laws of the Republic of India. Your use of the Service is also subject to our Privacy Policy, which is incorporated by reference into these Terms.',
        'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.'
      ]
    },
    {
      id: 'service-description',
      title: 'Description of Service',
      content: [
        'DayMatrix is a productivity and task management platform based on the Eisenhower Matrix methodology. Our service helps users prioritize tasks by categorizing them into four quadrants: urgent and important, important but not urgent, urgent but not important, and neither urgent nor important.',
        'The Service includes web-based applications, mobile applications, data synchronization, productivity analytics, and related features designed to enhance personal and professional productivity.',
        'We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. Scheduled maintenance, technical issues, or force majeure events may temporarily affect service availability.'
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      content: [
        'To access certain features of DayMatrix, you must create a user account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.',
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.',
        'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activities, or pose security risks to our Service or other users.'
      ],
      subsections: [
        {
          title: 'Account Security',
          content: [
            'You must choose a strong password and enable two-factor authentication when available.',
            'Do not share your account credentials with third parties or use your account for unauthorized commercial purposes.',
            'Regular security audits of your account activity are recommended to ensure account integrity.'
          ]
        },
        {
          title: 'Account Termination',
          content: [
            'You may terminate your account at any time through your account settings.',
            'Upon termination, your data will be retained for 30 days before permanent deletion, unless required by law to retain longer.',
            'We may terminate accounts immediately for violations of these terms or applicable laws.'
          ]
        }
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      content: [
        'You agree to use DayMatrix only for lawful purposes and in accordance with these Terms. You shall not use the Service to violate any applicable local, state, national, or international law or regulation.',
        'Prohibited activities include but are not limited to: attempting to gain unauthorized access to our systems, transmitting malicious code, engaging in harassment or abuse of other users, or using the Service for any illegal activities.',
        'You may not reverse engineer, decompile, or attempt to extract the source code of our Service, except to the extent permitted by applicable law.'
      ]
    },
    {
      id: 'privacy-data-protection',
      title: 'Privacy and Data Protection',
      content: [
        'Your privacy is important to us. Our Privacy Policy, which is part of these Terms, explains how we collect, use, and protect your personal information in compliance with applicable data protection laws, including the Information Technology Act, 2000 of India.',
        'By using our Service, you consent to the collection and use of your information as described in our Privacy Policy. We implement appropriate technical and organizational measures to ensure data security.',
        'You have rights regarding your personal data, including the right to access, correct, or delete your information. Please refer to our Privacy Policy for detailed information about your rights and how to exercise them.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: [
        'DayMatrix and all related intellectual property rights are owned by us or our licensors. This includes but is not limited to software, trademarks, copyrights, trade secrets, and patents.',
        'You are granted a limited, non-exclusive, non-transferable license to use the Service for your personal or internal business purposes. This license does not include the right to resell, distribute, or create derivative works.',
        'You retain ownership of any content you create using our Service. By using the Service, you grant us a limited license to host, store, and process your content solely for the purpose of providing the Service to you.'
      ]
    },
    {
      id: 'payment-billing',
      title: 'Payment and Billing Terms',
      content: [
        'DayMatrix offers both free and premium subscription plans. Premium features require payment of applicable subscription fees as described on our pricing page.',
        'All fees are charged in advance and are non-refundable except as required by applicable law or as explicitly stated in our refund policy. Subscription renewals are automatic unless cancelled before the renewal date.',
        'We reserve the right to change our pricing with 30 days advance notice to existing subscribers. Price changes will not affect your current billing cycle.'
      ],
      subsections: [
        {
          title: 'Payment Methods',
          content: [
            'We accept major credit cards, debit cards, and other payment methods as displayed during checkout.',
            'All payment processing is handled through secure, industry-standard payment processors.',
            'You authorize us to charge the payment method on file for applicable fees and taxes.'
          ]
        },
        {
          title: 'Refund Policy',
          content: [
            'Refunds may be issued within 30 days of payment for annual subscriptions if you have not actively used premium features.',
            'Monthly subscriptions are generally not eligible for refunds, but exceptions may be made at our discretion.',
            'Refund requests must be submitted through our support channels with appropriate justification.'
          ]
        }
      ]
    },
    {
      id: 'disclaimers-warranties',
      title: 'Disclaimers and Warranties',
      content: [
        'DayMatrix is provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.',
        'We do not warrant that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free. We make no warranty regarding the results that may be obtained from use of the Service.',
        'While we implement security measures to protect your data, we cannot guarantee absolute security. You acknowledge that internet-based services inherently involve security risks.'
      ]
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by applicable law, DayMatrix shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.',
        'Our total liability to you for all damages, losses, and causes of action shall not exceed the amount you have paid to us in the twelve (12) months preceding the claim, or one hundred rupees (₹100), whichever is greater.',
        'This limitation applies regardless of the legal theory upon which the claim is based, whether in contract, tort, negligence, strict liability, or otherwise.'
      ]
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      content: [
        'You agree to indemnify, defend, and hold harmless DayMatrix, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or relating to your use of the Service.',
        'This includes claims arising from your violation of these Terms, your violation of any rights of another party, or your violation of any applicable laws or regulations.',
        'We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.'
      ]
    },
    {
      id: 'termination',
      title: 'Termination of Service',
      content: [
        'These Terms remain in effect until terminated by either party. You may terminate your agreement with us at any time by discontinuing use of the Service and deleting your account.',
        'We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.',
        'Upon termination, your right to use the Service will cease immediately. Provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitation of liability.'
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Jurisdiction',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict of law principles.',
        'Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of India, and you hereby consent to personal jurisdiction and venue therein.',
        'The application of the United Nations Convention on Contracts for the International Sale of Goods is expressly excluded.'
      ]
    },
    {
      id: 'force-majeure',
      title: 'Force Majeure',
      content: [
        'We shall not be liable for any failure or delay in performance under these Terms which is due to fire, flood, earthquake, pandemic, governmental action, war, terrorism, or other causes beyond our reasonable control.',
        'In the event of force majeure, we will use reasonable efforts to minimize the impact on our Service and notify users of any significant disruptions.',
        'If a force majeure event continues for more than thirty (30) days, either party may terminate these Terms upon written notice.'
      ]
    },
    {
      id: 'miscellaneous',
      title: 'Miscellaneous Provisions',
      content: [
        'If any provision of these Terms is found to be unenforceable, the remainder shall continue in full force and effect. The failure to exercise any right provided in these Terms shall not be deemed a waiver of any further rights.',
        'These Terms constitute the entire agreement between you and DayMatrix concerning the Service and supersede all prior agreements and understandings, whether written or oral.',
        'We may assign our rights and obligations under these Terms without your consent. You may not assign your rights under these Terms without our prior written consent.'
      ]
    }
  ]);

  constructor() {}

  ngOnInit() {
    // Update SEO for terms page
    this.seoService.updateCustomSEO({
      title: 'Terms of Service - DayMatrix | Legal Terms and Conditions',
      description: 'Read DayMatrix Terms of Service to understand your rights and responsibilities when using our Eisenhower Matrix-based productivity platform. Governed by Indian law with comprehensive user protections.',
      keywords: 'DayMatrix terms of service, legal terms, user agreement, terms and conditions, productivity app legal, Eisenhower Matrix terms, Indian law compliance, user rights, service terms',
      url: 'https://daymatrix.app/terms',
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
