import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // {
  //   path: '',
  //   renderMode: RenderMode.Prerender
  // },
  // {
  //   path: 'home',
  //   renderMode: RenderMode.Prerender
  // },
  // { path: 'signup', renderMode: RenderMode.Prerender },
  // { path: 'signin', renderMode: RenderMode.Prerender },
  // { path: 'auth/callback', renderMode: RenderMode.Prerender },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'tasks',
    renderMode: RenderMode.Client,
  },
  {
    path: 'settings',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
