import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'daymatrix-theme';
  
  public readonly currentTheme = signal<Theme>('dark');
  
  constructor() {
    // Safely access localStorage only in browser environment
    if (this.isBrowser()) {
      const savedTheme = localStorage.getItem(this.storageKey) as Theme;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.currentTheme.set(savedTheme);
      }
    }
    
    // Apply theme changes to document
    effect(() => {
      const theme = this.currentTheme();
      this.document.documentElement.setAttribute('data-theme', theme);
      
      // Save to localStorage only in browser environment
      if (this.isBrowser()) {
        localStorage.setItem(this.storageKey, theme);
      }
    });
  }
  
  public toggleTheme(): void {
    this.currentTheme.update(current => current === 'dark' ? 'light' : 'dark');
  }
  
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
