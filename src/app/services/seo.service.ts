import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  
  private readonly defaultSEO: SEOData = {
    title: 'DayMatrix - Master Productivity with the Eisenhower Matrix',
    description: 'Transform decision paralysis into decisive action with DayMatrix. Implement President Eisenhower\'s proven decision-making framework for peak productivity and strategic focus.',
    keywords: 'Eisenhower Matrix, productivity app, task prioritization, time management, decision making framework',
    image: 'https://daymatrix.app/og-image.png',
    url: 'https://daymatrix.app',
    type: 'website',
    author: 'DayMatrix Team'
  };

  private readonly routeSEOData: { [key: string]: SEOData } = {
    '/': {
      title: 'DayMatrix - Master Productivity with the Eisenhower Matrix | Task Prioritization App',
      description: 'Transform decision paralysis into decisive action with DayMatrix. Implement President Eisenhower\'s proven decision-making framework for peak productivity and strategic focus. Join 12,000+ active users achieving 89% productivity increases.',
      keywords: 'Eisenhower Matrix, productivity app, task prioritization, time management, decision making framework, task manager, productivity tool, urgent important matrix, President Eisenhower methodology, strategic focus, decision paralysis',
      url: 'https://daymatrix.app/',
      type: 'website'
    },
    '/home': {
      title: 'DayMatrix - Master Productivity with the Eisenhower Matrix | Task Prioritization App',
      description: 'Transform decision paralysis into decisive action with DayMatrix. Implement President Eisenhower\'s proven decision-making framework for peak productivity and strategic focus. Join 12,000+ active users achieving 89% productivity increases.',
      keywords: 'Eisenhower Matrix, productivity app, task prioritization, time management, decision making framework, task manager, productivity tool, urgent important matrix, President Eisenhower methodology, strategic focus, decision paralysis',
      url: 'https://daymatrix.app/home',
      type: 'website'
    },
    '/dashboard': {
      title: 'Dashboard - DayMatrix | Your Productivity Command Center',
      description: 'Access your personalized productivity dashboard. Monitor tasks, track progress, and optimize your workflow using the Eisenhower Matrix methodology. View real-time analytics and manage your strategic priorities.',
      keywords: 'productivity dashboard, task management dashboard, Eisenhower Matrix dashboard, productivity tracking, workflow optimization, task analytics, personal productivity center, strategic task overview',
      url: 'https://daymatrix.app/dashboard',
      type: 'webapp'
    },
    '/tasks': {
      title: 'Task Manager - DayMatrix | Eisenhower Matrix Task Prioritization',
      description: 'Organize and prioritize your tasks using the proven Eisenhower Matrix framework. Categorize tasks by urgency and importance for maximum productivity. Manage your four quadrants: Do, Decide, Delegate, Delete.',
      keywords: 'task manager, task prioritization, Eisenhower Matrix tasks, urgent important matrix, productivity tasks, task organization, four quadrants, strategic task management, task categorization, priority matrix',
      url: 'https://daymatrix.app/tasks',
      type: 'webapp'
    },
    '/analytics': {
      title: 'Analytics - DayMatrix | Productivity Insights & Performance Tracking',
      description: 'Gain deep insights into your productivity patterns with comprehensive analytics. Track performance metrics, analyze time usage across quadrants, and optimize your decision-making process using Eisenhower Matrix data.',
      keywords: 'productivity analytics, performance tracking, productivity insights, time management analytics, workflow analysis, Eisenhower Matrix analytics, productivity metrics, decision-making insights, performance optimization',
      url: 'https://daymatrix.app/analytics',
      type: 'webapp'
    },
    '/settings': {
      title: 'Settings - DayMatrix | Customize Your Productivity Experience',
      description: 'Personalize your DayMatrix experience with customizable settings. Configure preferences, manage account details, customize notifications, and optimize your productivity workflow for maximum effectiveness.',
      keywords: 'DayMatrix settings, account management, productivity preferences, app configuration, notification settings, workflow customization, user preferences, productivity optimization settings',
      url: 'https://daymatrix.app/settings',
      type: 'webapp'
    },
    '/signin': {
      title: 'Sign In - DayMatrix | Access Your Productivity Dashboard',
      description: 'Sign in to DayMatrix to access your personalized productivity dashboard and start implementing the Eisenhower Matrix methodology. Secure login with Google authentication and email options.',
      keywords: 'DayMatrix login, sign in, productivity app login, task manager login, Eisenhower Matrix access, secure authentication, Google sign in, productivity dashboard access',
      url: 'https://daymatrix.app/signin',
      type: 'website'
    },
    '/signup': {
      title: 'Sign Up - DayMatrix | Start Your Productivity Transformation',
      description: 'Create your free DayMatrix account and begin mastering productivity with the Eisenhower Matrix. Join thousands of professionals achieving peak performance through strategic task prioritization.',
      keywords: 'DayMatrix signup, create account, free productivity app, Eisenhower Matrix signup, task manager registration, productivity transformation, strategic planning tool, decision-making framework access',
      url: 'https://daymatrix.app/signup',
      type: 'website'
    },
    '/auth/callback': {
      title: 'Authentication - DayMatrix | Completing Your Sign In',
      description: 'Completing your secure authentication to DayMatrix. You\'ll be redirected to your productivity dashboard momentarily to start using the Eisenhower Matrix methodology.',
      keywords: 'DayMatrix authentication, OAuth callback, secure login, Google authentication, sign in process',
      url: 'https://daymatrix.app/auth/callback',
      type: 'website'
    }
  };

  constructor() {
    // Update SEO data on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateSEOData(event.url);
      });
  }

  updateSEOData(url?: string): void {
    const currentUrl = url || this.router.url;
    const seoData = this.routeSEOData[currentUrl] || this.defaultSEO;
    
    this.setTitle(seoData.title);
    this.setMetaDescription(seoData.description);
    this.setMetaKeywords(seoData.keywords || this.defaultSEO.keywords!);
    this.setOpenGraphTags(seoData);
    this.setTwitterCardTags(seoData);
    this.setCanonicalUrl(seoData.url || this.defaultSEO.url!);
    this.setStructuredData(seoData);
  }

  setTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  setMetaDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  setMetaKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  setOpenGraphTags(seoData: SEOData): void {
    this.meta.updateTag({ property: 'og:type', content: seoData.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: seoData.url || this.defaultSEO.url! });
    this.meta.updateTag({ property: 'og:image', content: seoData.image || this.defaultSEO.image! });
    this.meta.updateTag({ property: 'og:site_name', content: 'DayMatrix' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    
    if (seoData.author) {
      this.meta.updateTag({ property: 'article:author', content: seoData.author });
    }
    
    if (seoData.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: seoData.publishedTime });
    }
    
    if (seoData.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: seoData.modifiedTime });
    }
    
    if (seoData.section) {
      this.meta.updateTag({ property: 'article:section', content: seoData.section });
    }
    
    if (seoData.tags) {
      seoData.tags.forEach(tag => {
        this.meta.updateTag({ property: 'article:tag', content: tag });
      });
    }
  }

  setTwitterCardTags(seoData: SEOData): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@daymatrix' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@daymatrix' });
    this.meta.updateTag({ name: 'twitter:url', content: seoData.url || this.defaultSEO.url! });
    this.meta.updateTag({ name: 'twitter:image', content: seoData.image || this.defaultSEO.image! });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'DayMatrix - Eisenhower Matrix Productivity App' });
  }

  setCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    // Add new canonical link
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    document.head.appendChild(canonical);
  }

  setStructuredData(seoData: SEOData): void {
    // Remove existing structured data
    const existingSD = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data');
    if (existingSD) {
      existingSD.remove();
    }

    let structuredData: any;

    switch (seoData.type) {
      case 'webapp':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'DayMatrix',
          'url': seoData.url,
          'description': seoData.description,
          'applicationCategory': 'ProductivityApplication',
          'operatingSystem': 'Web Browser',
          'browserRequirements': 'Requires JavaScript. Requires HTML5.',
          'creator': {
            '@type': 'Organization',
            'name': 'DayMatrix'
          }
        };
        break;
      default:
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': seoData.title,
          'url': seoData.url,
          'description': seoData.description,
          'isPartOf': {
            '@type': 'WebSite',
            'name': 'DayMatrix',
            'url': 'https://daymatrix.app'
          },
          'author': {
            '@type': 'Organization',
            'name': 'DayMatrix'
          }
        };
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'dynamic-structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // Method for custom SEO updates
  updateCustomSEO(seoData: Partial<SEOData>): void {
    const fullSEOData = { ...this.defaultSEO, ...seoData };
    
    if (fullSEOData.title) this.setTitle(fullSEOData.title);
    if (fullSEOData.description) this.setMetaDescription(fullSEOData.description);
    if (fullSEOData.keywords) this.setMetaKeywords(fullSEOData.keywords);
    
    this.setOpenGraphTags(fullSEOData);
    this.setTwitterCardTags(fullSEOData);
    if (fullSEOData.url) this.setCanonicalUrl(fullSEOData.url);
    this.setStructuredData(fullSEOData);
  }

  // Generate dynamic meta for user-specific pages
  generateUserPageSEO(userName: string, pageType: 'dashboard' | 'tasks' | 'analytics'): SEOData {
    const baseTitle = `${userName}'s ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - DayMatrix`;
    const baseDescription = `${userName}'s personalized ${pageType} on DayMatrix. Track productivity and manage tasks using the Eisenhower Matrix methodology.`;
    
    return {
      title: baseTitle,
      description: baseDescription,
      keywords: `${pageType}, productivity, Eisenhower Matrix, ${userName}, personal dashboard`,
      url: `https://daymatrix.app/${pageType}`,
      type: 'webapp'
    };
  }
}
