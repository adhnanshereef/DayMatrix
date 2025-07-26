import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="notfound-page">
      <div class="notfound-3d-bg">
        <div class="floating-element element1"></div>
        <div class="floating-element element2"></div>
        <div class="floating-element element3"></div>
        <div class="floating-element element4"></div>
        <div class="floating-element element5"></div>
      </div>
      <div class="notfound-card">
        <div class="card-glow"></div>
        <div class="notfound-content">
          <div class="notfound-404">
            <span class="digit digit-4" data-text="4">4</span>
            <span class="digit digit-0" data-text="0">0</span>
            <span class="digit digit-4-2" data-text="4">4</span>
          </div>
          <div class="error-details">
            <h2 class="notfound-title">Page Not Found</h2>
            <p class="notfound-message">
              The page you're looking for seems to have vanished into the digital void.
            </p>
          </div>
          <div class="action-buttons">
            <button class="notfound-home primary-btn" routerLink="/" type="button">
              <span class="btn-text">Return Home</span>
              <div class="btn-ripple"></div>
            </button>
            <button class="secondary-btn" type="button" onclick="history.back()">
              <span class="btn-text">Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {}