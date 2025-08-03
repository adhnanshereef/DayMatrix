import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SignInPayload, SignupPayload } from '../interfaces/profile';
import { BehaviorSubject } from 'rxjs';
import { Task, TaskInput } from '../interfaces/tasks';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  user$ = new BehaviorSubject<User | null>(null);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private readonly alertService = inject(AlertService);

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
    if (isPlatformBrowser(this.platformId)) {
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

  async signInWithGoogle() {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };
    
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  async signUpWithGoogle() {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };
    
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  async editName(name: string) {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };
    const { error } = await this.supabase.auth.updateUser({
      data: { displayName: name }
    });
    return { error };
  }

  async deleteAccount(password: string) {
    if (!this.supabase) return { error: { message: 'Supabase client not available on server' } };
    if (!this.user) return { error: { message: 'User not signed in' } };
    const { error } = await this.supabase.auth.signInWithPassword({
      email: this.user.email ? this.user.email : '',
      password
    });
    if (error) return { error };


    const { error: deleteError } = await this.supabase.auth.admin.deleteUser(this.user.id);
    if (deleteError) return { error: deleteError };

    this.user$.next(null);
    return { error: null };
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

  async createTask(task: TaskInput) {
    if (!this.supabase) return {};

    if (!this.isSignedIn()) {
      this.alertService.warning('Please sign in to create tasks', 'Authentication Required');
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

  // DELETE
  async deleteTask(taskId: string) {
    if (!this.supabase) return;
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      this.alertService.error('Failed to delete task. Please try again.', 'Delete Failed');
    } else {
      this.loadTasks(); // Refresh the list
    }
  }

  // UPDATE
  async updateTask(task: Task) {
    if (!this.supabase) return{};
    const { error } = await this.supabase
      .from('tasks')
      .update({
        task: task.task,
        description: task.description,
        due: task.due
      })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
      this.alertService.error('Failed to update task. Please try again.', 'Update Failed');
    } else {
      this.loadTasks(); // Refresh the list
    }
    return { error };
  }

  // Set as completed
  async completeTask(taskId: string) {
    if (!this.supabase) return;
    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);

    if (error) {
      console.error('Error completing task:', error);
      this.alertService.error('Failed to mark task as complete. Please try again.', 'Update Failed');
    } else {
      this.loadTasks(); // Refresh the list
    }
  }

  // Set as uncompleted
  async uncompleteTask(taskId: string) {
    if (!this.supabase) return;
    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: false })
      .eq('id', taskId);

    if (error) {
      console.error('Error uncompleting task:', error);
      this.alertService.error('Failed to mark task as incomplete. Please try again.', 'Update Failed');
    } else {
      this.loadTasks(); // Refresh the list
    }
  }
}
