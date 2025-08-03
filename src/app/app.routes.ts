import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/auth/signin.component').then(m => m.SigninComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./pages/auth/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/legal/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/legal/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found.component').then(m => m.NotFoundComponent)
  }
];
