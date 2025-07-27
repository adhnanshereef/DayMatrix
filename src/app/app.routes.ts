import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks.component').then(m => m.TasksComponent),
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin.component').then(m => m.SigninComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found.component').then(m => m.NotFoundComponent)
  }
];
