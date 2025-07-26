import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SignInPayload, SignupPayload } from '../interfaces/profile';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  user$ = new BehaviorSubject<User | null>(null);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );

      // Initialize user state
      this.supabase.auth.getUser().then(({ data: { user } }) => {
        this.user$.next(user);
      });

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.user$.next(session?.user ?? null);
      });

      this.user$.subscribe(user => {
        if (user) {
          this.loadTasks();
        } else {
          this.tasksSubject.next([]);
        }
      });
    }
  }

  isSignedIn(): boolean {
    if(isPlatformBrowser(this.platformId)){
      return this.user$.value !== null;
    }
    return true;
  }

  async signInWithEmail(payload: SignInPayload) {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };
    return await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
  }

  async signUpWithEmail(payload: SignupPayload) {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };

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

  get user() {
    return this.user$.getValue();
  }

  async getUser() {
    if (!this.supabase) return;
    return await this.supabase.auth.getUser();
  }

  async signOut() {
    if (!this.supabase) return;
    return await this.supabase.auth.signOut();
  }

  // async resetPassword(email: string) {
  //  if(!this.supabase) return;)
  //   return await this.supabase.auth.resetPasswordForEmail(email);
  // }

  async createTask(task: { task: string, description: string, due: Date | null, quadrant: string }) {
    if (!this.supabase) return {};
    
    if (!this.isSignedIn()) {
      alert('You must be signed in to create a task');
      return {};
    }

    const { data, error } = await this.supabase.from('tasks').insert({
      task: task.task,
      description: task.description,
      due: task.due,
      quadrant: task.quadrant
    }).select('*');
    if (!error) {
      this.loadTasks(); // Refresh the list
    }

    return { data, error };
  }

  // READ
  async loadTasks(): Promise<void> {
    if (!this.supabase) return;
    const user = this.user;
    if (!user) return;

    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
    } else {
      this.tasksSubject.next(data || []);
    }
  }


}
