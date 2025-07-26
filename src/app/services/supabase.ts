import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SignInPayload, SignupPayload } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    }
  }

  async signInWithEmail(payload: SignInPayload) {
    if (!this.supabase) throw new Error('Supabase client not available on server');
    return await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
  }

  async signUpWithEmail(payload: SignupPayload) {
    if (!this.supabase) throw new Error('Supabase client not available on server');
    console.log(payload);
    
    return await this.supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          displayName: payload.name,
        },
      },
    });
  }

  async getUser() {
    if (!this.supabase) throw new Error('Supabase client not available on server');
    return await this.supabase.auth.getUser();
  }

  async signOut() {
    if (!this.supabase) throw new Error('Supabase client not available on server');
    return await this.supabase.auth.signOut();
  }

  // async resetPassword(email: string) {
  //   if (!this.supabase) throw new Error('Supabase client not available on server');
  //   return await this.supabase.auth.resetPasswordForEmail(email);
  // }

  
}
