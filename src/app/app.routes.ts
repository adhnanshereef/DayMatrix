import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks.component').then(m => m.TasksComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
