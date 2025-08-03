import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { Task } from '../interfaces/tasks';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  template: `
    <!-- Background Gradient Shapes -->
    <div class="background-gradient-shapes">
      <div class="gradient-oval gradient-oval-1"></div>
      <div class="gradient-oval gradient-oval-2"></div>
      <div class="gradient-oval gradient-oval-3"></div>
      <div class="gradient-oval gradient-oval-4"></div>
      <div class="gradient-oval gradient-oval-5"></div>
    </div>

    <div class="page-container">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Your productivity command center</p>
        
        @if(user){
          <div class="user-welcome">
            <div class="welcome-card">
              <div class="welcome-avatar">
                <span>{{ (user.user_metadata['displayName'] || 'User')[0].toUpperCase() }}</span>
              </div>
              <div class="welcome-content">
                <h2>Welcome back, {{ user.user_metadata['displayName'] || 'User' }}!</h2>
                <p>{{ user.email }}</p>
                <div class="welcome-stats">
                  <span>{{ getCurrentDate() }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getCompletedTasksToday() }}</h3>
            <p>Tasks Completed Today</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getActiveTasks() }}</h3>
            <p>Active Tasks</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getUpcomingDeadlines() }}</h3>
            <p>Due This Week</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getProductivityScore() }}%</h3>
            <p>Productivity Score</p>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Recent Tasks Widget -->
        <div class="dashboard-widget recent-tasks-widget">
          <div class="widget-header">
            <h3>Recent Tasks</h3>
            <button class="view-all-btn" (click)="navigateToTasks()">
              <span>View All</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div class="widget-content">
            @if (recentTasks().length > 0) {
              @for (task of recentTasks(); track task.id) {
                <div class="task-item" [class.completed]="task.completed">
                  <div class="task-checkbox" 
                       [class.completed]="task.completed"
                       (click)="$event.stopPropagation(); toggleTaskCompletion(task)">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                  <div class="task-info">
                    <h4>{{ task.task }}</h4>
                    <p>{{ getQuadrantLabel(task.quadrant) }}</p>
                  </div>
                  @if (task.due) {
                    <div class="task-due">
                      {{ task.due | date:'MMM d' }}
                    </div>
                  }
                </div>
              }
            } @else {
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                </svg>
                <p>No tasks yet. Create your first task!</p>
                <button class="create-task-btn" (click)="navigateToTasks()">
                  Create Task
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Priority Distribution Chart -->
        <div class="dashboard-widget chart-widget">
          <div class="widget-header">
            <h3>Priority Distribution</h3>
            <div class="chart-legend">
              <span class="total-tasks">{{ getTotalActiveTasks() }} Active Tasks</span>
            </div>
          </div>
          <div class="widget-content">
            @if (getTotalActiveTasks() > 0) {
              <div class="priority-chart">
                @for (priority of getPriorityData(); track priority.id) {
                  <div class="priority-item">
                    <div class="priority-header">
                      <div class="priority-info">
                        <div class="priority-icon" [style.color]="priority.color" [innerHTML]="getQuadrantIcon(priority.icon)"></div>
                        <div class="priority-details">
                          <span class="priority-name">{{ priority.name }}</span>
                          <span class="priority-description">{{ priority.description }}</span>
                        </div>
                      </div>
                      <div class="priority-stats">
                        <span class="priority-count">{{ priority.count }}</span>
                        <span class="priority-percentage">{{ priority.percentage }}%</span>
                      </div>
                    </div>
                    <div class="priority-bar-container">
                      <div class="priority-bar" 
                           [style.width]="priority.percentage + '%'" 
                           [style.background]="priority.color">
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 11H1v12h8V11z"/>
                  <path d="M23 11h-8v12h8V11z"/>
                  <path d="M11 1L5.5 7.5 11 14l5.5-6.5L11 1z"/>
                </svg>
                <p>No active tasks to analyze</p>
                <p class="empty-subtitle">Create tasks to see priority distribution</p>
              </div>
            }
          </div>
        </div>

        <!-- Weekly Progress -->
        <div class="dashboard-widget progress-widget">
          <div class="widget-header">
            <h3>Weekly Progress</h3>
          </div>
          <div class="widget-content">
            <div class="progress-chart">
              @for (day of getWeeklyProgress(); track day.name) {
                <div class="progress-day">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.height]="day.percentage + '%'"></div>
                  </div>
                  <span class="day-label">{{ day.name }}</span>
                  <span class="day-count">{{ day.count }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-widget actions-widget">
          <div class="widget-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="widget-content">
            <div class="action-grid">
              <button class="action-btn" (click)="navigateToTasks()">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                </div>
                <span>Add Task</span>
              </button>
              <button class="action-btn" (click)="navigateToTasks()">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H1v12h8V11z"/>
                    <path d="M23 11h-8v12h8V11z"/>
                    <path d="M11 1L5.5 7.5 11 14l5.5-6.5L11 1z"/>
                  </svg>
                </div>
                <span>View Matrix</span>
              </button>
              <button class="action-btn" (click)="navigateToAnalytics()">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                  </svg>
                </div>
                <span>Analytics</span>
              </button>
              <button class="action-btn" (click)="navigateToSettings()">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Achievement Section -->
        <div class="dashboard-widget achievement-widget">
          <div class="widget-header">
            <h3>Today's Achievement</h3>
          </div>
          <div class="widget-content">
            <div class="achievement-content">
              <div class="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <div class="achievement-text">
                <h4>{{ getAchievementTitle() }}</h4>
                <p>{{ getAchievementDescription() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  
  private subscriptions = new Subscription();

  // Signal to hold current tasks
  private readonly currentTasks = signal<Task[]>([]);
  
  // Reactive tasks observable
  readonly tasks$ = this.supabaseService.tasks$;

  // Computed signals for reactive data
  readonly recentTasks = computed(() => {
    return this.currentTasks()
      .filter(task => !task.completed)
      .slice(0, 5); // Show only 5 most recent active tasks
  });

  readonly totalActiveTasks = computed(() => {
    return this.currentTasks().filter(task => !task.completed).length;
  });

  readonly tasksByQuadrant = computed(() => {
    const tasks = this.currentTasks();
    
    return {
      'important-urgent': tasks.filter(task => task.quadrant === 'important-urgent' && !task.completed),
      'important-not-urgent': tasks.filter(task => task.quadrant === 'important-not-urgent' && !task.completed),
      'not-important-urgent': tasks.filter(task => task.quadrant === 'not-important-urgent' && !task.completed),
      'not-important-not-urgent': tasks.filter(task => task.quadrant === 'not-important-not-urgent' && !task.completed)
    };
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Subscribe to user changes
      this.subscriptions.add(
        this.supabaseService.user$.subscribe(user => {
          this.user = user;
        })
      );

      // Subscribe to tasks changes
      this.subscriptions.add(
        this.tasks$.subscribe((tasks: Task[]) => {
          this.currentTasks.set(tasks);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Navigation methods
  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  // Data methods
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getCompletedTasksToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.currentTasks().filter(task => {
      if (!task.completed || !task.updated_at) return false;
      
      const completedDate = new Date(task.updated_at);
      completedDate.setHours(0, 0, 0, 0);
      
      return completedDate.getTime() === today.getTime();
    }).length;
  }

  getActiveTasks(): number {
    return this.getTotalActiveTasks();
  }

  getUpcomingDeadlines(): number {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return this.currentTasks().filter(task => {
      if (!task.due || task.completed) return false;
      
      const dueDate = new Date(task.due);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;
  }

  getProductivityScore(): number {
    const allTasks = this.currentTasks();
    if (allTasks.length === 0) return 0;
    
    const completedTasks = allTasks.filter(task => task.completed).length;
    const score = Math.round((completedTasks / allTasks.length) * 100);
    
    return Math.max(score, 0); // Ensure minimum 0%
  }

  getQuadrantLabel(quadrant: string): string {
    const labels: { [key: string]: string } = {
      'important-urgent': 'Do First',
      'important-not-urgent': 'Schedule',
      'not-important-urgent': 'Delegate',
      'not-important-not-urgent': 'Eliminate'
    };
    return labels[quadrant] || 'Unknown';
  }

  getTaskCountByQuadrant(quadrant: string): number {
    const tasks = this.tasksByQuadrant();
    return tasks[quadrant as keyof typeof tasks]?.length || 0;
  }

  getTotalActiveTasks(): number {
    return this.totalActiveTasks();
  }

  getPriorityPercentage(quadrant: string): number {
    const totalTasks = this.getTotalActiveTasks();
    if (totalTasks === 0) return 0;
    const quadrantTasks = this.getTaskCountByQuadrant(quadrant);
    return (quadrantTasks / totalTasks) * 100;
  }

  getPriorityData(): any[] {
    const quadrants = [
      {
        id: 'important-urgent',
        name: 'Do First',
        description: 'Important & Urgent',
        color: '#ef4444',
        icon: 'fire'
      },
      {
        id: 'important-not-urgent',
        name: 'Schedule',
        description: 'Important & Not Urgent',
        color: '#3b82f6',
        icon: 'calendar'
      },
      {
        id: 'not-important-urgent',
        name: 'Delegate',
        description: 'Not Important & Urgent',
        color: '#f59e0b',
        icon: 'users'
      },
      {
        id: 'not-important-not-urgent',
        name: 'Eliminate',
        description: 'Not Important & Not Urgent',
        color: '#6b7280',
        icon: 'trash'
      }
    ];

    return quadrants.map(quadrant => {
      const count = this.getTaskCountByQuadrant(quadrant.id);
      const percentage = this.getPriorityPercentage(quadrant.id);
      return {
        ...quadrant,
        count,
        percentage: Math.round(percentage)
      };
    });
  }

  getQuadrantIcon(iconType: string): string {
    const icons: { [key: string]: string } = {
      'fire': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>`,
      'calendar': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>`,
      'users': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`,
      'trash': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>`
    };
    return icons[iconType] || '';
  }

  // Task completion functionality
  async toggleTaskCompletion(task: Task): Promise<void> {
    try {
      if (task.completed) {
        await this.supabaseService.uncompleteTask(task.id);
      } else {
        await this.supabaseService.completeTask(task.id);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      this.alertService.error('Unable to update task status. Please try again.', 'Update Failed');
    }
  }

  getWeeklyProgress(): any[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    
    // Get Monday of current week
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return days.map((dayName, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      dayDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(dayDate);
      nextDay.setDate(dayDate.getDate() + 1);
      
      const completedOnDay = this.currentTasks().filter(task => {
        if (!task.completed || !task.updated_at) return false;
        
        const completedDate = new Date(task.updated_at);
        return completedDate >= dayDate && completedDate < nextDay;
      }).length;
      
      // Calculate percentage relative to max tasks in a day (for visual scaling)
      const maxTasksPerDay = 12; // Adjust based on your needs
      const percentage = Math.min((completedOnDay / maxTasksPerDay) * 100, 100);
      
      return {
        name: dayName,
        count: completedOnDay,
        percentage: Math.max(percentage, completedOnDay > 0 ? 10 : 0) // Minimum 10% if any tasks completed
      };
    });
  }

  getAchievementTitle(): string {
    const achievements = [
      "Streak Master!",
      "Priority Pro!",
      "Task Terminator!",
      "Focus Champion!",
      "Productivity Ninja!"
    ];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  getAchievementDescription(): string {
    const descriptions = [
      "You've completed tasks for 5 days straight!",
      "Excellent job prioritizing urgent tasks today!",
      "You've knocked out 10 tasks this week!",
      "2 hours of focused work completed!",
      "Maintained 90%+ productivity this week!"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}
