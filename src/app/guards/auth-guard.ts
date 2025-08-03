import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    // On the server, skip navigation and allow activation
    return true;
  }


  console.log('Auth guard activated for route:', state.url);
  

  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const isSignedIn = await supabaseService.isSignedIn();
  if (!isSignedIn) {
    const user = supabaseService.user$.value;
    if (!user) {
      router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
  return true;
};