import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <!-- Background Gradient Shapes -->
    <div class="background-gradient-shapes">
      <div class="gradient-oval gradient-oval-1"></div>
      <div class="gradient-oval gradient-oval-2"></div>
      <div class="gradient-oval gradient-oval-3"></div>
      <div class="gradient-oval gradient-oval-4"></div>
      <div class="gradient-oval gradient-oval-5"></div>
    </div>

    <div class="page-container">
      <div class="notfound-content">
        <!-- 3D Object Container -->
        <div class="object-3d-container">
          <div class="cube-3d">
            <div class="face front">4</div>
            <div class="face back">4</div>
            <div class="face top">0</div>
            <div class="face bottom">0</div>
            <div class="face left">4</div>
            <div class="face right">4</div>
          </div>
        </div>

        <!-- Error Card -->
        <div class="error-card">
          <div class="error-header">
            <div class="error-number">404</div>
            <h1 class="error-title">Page Not Found</h1>
            <p class="error-description">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div class="action-buttons">
            <button class="primary-action-btn" routerLink="/" type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span>Return Home</span>
            </button>
            <button class="secondary-action-btn" type="button" (click)="goBack()">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5m7 7l-7-7 7-7"/>
              </svg>
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    // Update SEO for 404 page
    this.seoService.updateCustomSEO({
      title: '404 - Page Not Found | DayMatrix',
      description: 'The page you\'re looking for doesn\'t exist or has been moved. Return to DayMatrix to continue your productivity journey with the Eisenhower Matrix methodology.',
      keywords: '404, page not found, DayMatrix, productivity app, Eisenhower Matrix',
      url: 'https://daymatrix.app/404',
      type: 'website'
    });
  }

  goBack(): void {
    this.location.back();
  }
}