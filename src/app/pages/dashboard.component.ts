import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p>Dashboard content coming soon...</p>
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
export class DashboardComponent {
}
