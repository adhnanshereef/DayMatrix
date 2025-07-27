import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'signin', renderMode: RenderMode.Prerender },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
