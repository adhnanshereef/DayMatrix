import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-analytics',
  template: `
    <div class="page-container">
      <h1>Analytics</h1>
      <p>Analytics and insights coming soon...</p>
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
export class AnalyticsComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    // Update SEO for analytics page
    this.seoService.updateCustomSEO({
      title: 'Analytics - DayMatrix | Productivity Insights & Performance Tracking',
      description: 'Gain deep insights into your productivity patterns with comprehensive analytics. Track performance metrics, analyze time usage across quadrants, and optimize your decision-making process using Eisenhower Matrix data.',
      keywords: 'productivity analytics, performance tracking, productivity insights, time management analytics, workflow analysis, Eisenhower Matrix analytics, productivity metrics, decision-making insights, performance optimization',
      url: 'https://daymatrix.app/analytics',
      type: 'webapp'
    });
  }
}
