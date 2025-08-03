import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { QuadrantKey, Task, TaskInput } from '../interfaces/tasks';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, DatePipe],
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
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Task Matrix</h1>
        <p class="page-subtitle">Organize your tasks using the Eisenhower Decision Matrix</p>
      </div>

      <!-- Eisenhower Matrix Grid -->
      <div class="matrix-container">
        <div class="matrix-labels">
          <div class="axis-label vertical-label">
            <span class="label-text">Important</span>
            <div class="label-arrow"></div>
          </div>
          <div class="axis-label horizontal-label">
            <span class="label-text">Urgent</span>
            <div class="label-arrow"></div>
          </div>
        </div>

        <div class="matrix-grid">
          <!-- Quadrant 1: Do (Important & Urgent) -->
          <div class="quadrant do-quadrant" data-quadrant="important-urgent">
            <div class="quadrant-header">
              <div class="quadrant-title">
                <div class="quadrant-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <span>Do First</span>
                <div class="task-count">{{ getTaskCount('important-urgent') }}</div>
              </div>
              <button class="add-task-btn" (click)="openTaskModal('important-urgent')" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              </button>
            </div>
            
            <div class="task-list" [class.empty]="getTasksByQuadrant('important-urgent').length === 0">
              @if (getTasksByQuadrant('important-urgent').length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <p>Crisis management tasks</p>
                </div>
              } @else {
                @for (task of getTasksByQuadrant('important-urgent'); track task.id) {
                  <div class="task-card" (click)="openTaskDetail(task)">
                    <div class="task-main">
                      <button 
                        class="task-checkbox" 
                        (click)="$event.stopPropagation(); toggleTaskCompletion(task)"
                        [class.completed]="task.completed"
                        type="button">
                        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <div class="task-content">
                        <h3 class="task-title" [class.completed]="task.completed">{{ task.task }}</h3>
                        @if (task.due) {
                          <div class="task-due">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {{ task.due | date:'MMM d' }}
                          </div>
                        }
                      </div>
                    </div>
                    <div class="task-actions">
                      <button class="action-btn edit-btn" (click)="$event.stopPropagation(); editTask(task)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete-btn" (click)="$event.stopPropagation(); deleteTask(task.id)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Quadrant 2: Decide (Important & Not Urgent) -->
          <div class="quadrant decide-quadrant" data-quadrant="important-not-urgent">
            <div class="quadrant-header">
              <div class="quadrant-title">
                <div class="quadrant-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H1v12h8V11z"/>
                    <path d="M23 11h-8v12h8V11z"/>
                    <path d="M11 1L5.5 7.5 11 14l5.5-6.5L11 1z"/>
                  </svg>
                </div>
                <span>Schedule</span>
                <div class="task-count">{{ getTaskCount('important-not-urgent') }}</div>
              </div>
              <button class="add-task-btn" (click)="openTaskModal('important-not-urgent')" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              </button>
            </div>
            
            <div class="task-list" [class.empty]="getTasksByQuadrant('important-not-urgent').length === 0">
              @if (getTasksByQuadrant('important-not-urgent').length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M9 11H1v12h8V11z"/>
                      <path d="M23 11h-8v12h8V11z"/>
                      <path d="M11 1L5.5 7.5 11 14l5.5-6.5L11 1z"/>
                    </svg>
                  </div>
                  <p>Strategic planning tasks</p>
                </div>
              } @else {
                @for (task of getTasksByQuadrant('important-not-urgent'); track task.id) {
                  <div class="task-card" (click)="openTaskDetail(task)">
                    <div class="task-main">
                      <button 
                        class="task-checkbox" 
                        (click)="$event.stopPropagation(); toggleTaskCompletion(task)"
                        [class.completed]="task.completed"
                        type="button">
                        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <div class="task-content">
                        <h3 class="task-title" [class.completed]="task.completed">{{ task.task }}</h3>
                        @if (task.due) {
                          <div class="task-due">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {{ task.due | date:'MMM d' }}
                          </div>
                        }
                      </div>
                    </div>
                    <div class="task-actions">
                      <button class="action-btn edit-btn" (click)="$event.stopPropagation(); editTask(task)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete-btn" (click)="$event.stopPropagation(); deleteTask(task.id)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Quadrant 3: Delegate (Not Important & Urgent) -->
          <div class="quadrant delegate-quadrant" data-quadrant="not-important-urgent">
            <div class="quadrant-header">
              <div class="quadrant-title">
                <div class="quadrant-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span>Delegate</span>
                <div class="task-count">{{ getTaskCount('not-important-urgent') }}</div>
              </div>
              <button class="add-task-btn" (click)="openTaskModal('not-important-urgent')" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              </button>
            </div>
            
            <div class="task-list" [class.empty]="getTasksByQuadrant('not-important-urgent').length === 0">
              @if (getTasksByQuadrant('not-important-urgent').length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <p>Tasks to delegate</p>
                </div>
              } @else {
                @for (task of getTasksByQuadrant('not-important-urgent'); track task.id) {
                  <div class="task-card" (click)="openTaskDetail(task)">
                    <div class="task-main">
                      <button 
                        class="task-checkbox" 
                        (click)="$event.stopPropagation(); toggleTaskCompletion(task)"
                        [class.completed]="task.completed"
                        type="button">
                        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <div class="task-content">
                        <h3 class="task-title" [class.completed]="task.completed">{{ task.task }}</h3>
                        @if (task.due) {
                          <div class="task-due">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {{ task.due | date:'MMM d' }}
                          </div>
                        }
                      </div>
                    </div>
                    <div class="task-actions">
                      <button class="action-btn edit-btn" (click)="$event.stopPropagation(); editTask(task)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete-btn" (click)="$event.stopPropagation(); deleteTask(task.id)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Quadrant 4: Delete (Not Important & Not Urgent) -->
          <div class="quadrant delete-quadrant" data-quadrant="not-important-not-urgent">
            <div class="quadrant-header">
              <div class="quadrant-title">
                <div class="quadrant-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </div>
                <span>Eliminate</span>
                <div class="task-count">{{ getTaskCount('not-important-not-urgent') }}</div>
              </div>
              <button class="add-task-btn" (click)="openTaskModal('not-important-not-urgent')" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              </button>
            </div>
            
            <div class="task-list" [class.empty]="getTasksByQuadrant('not-important-not-urgent').length === 0">
              @if (getTasksByQuadrant('not-important-not-urgent').length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    </svg>
                  </div>
                  <p>Tasks to eliminate</p>
                </div>
              } @else {
                @for (task of getTasksByQuadrant('not-important-not-urgent'); track task.id) {
                  <div class="task-card" (click)="openTaskDetail(task)">
                    <div class="task-main">
                      <button 
                        class="task-checkbox" 
                        (click)="$event.stopPropagation(); toggleTaskCompletion(task)"
                        [class.completed]="task.completed"
                        type="button">
                        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <div class="task-content">
                        <h3 class="task-title" [class.completed]="task.completed">{{ task.task }}</h3>
                        @if (task.due) {
                          <div class="task-due">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {{ task.due | date:'MMM d' }}
                          </div>
                        }
                      </div>
                    </div>
                    <div class="task-actions">
                      <button class="action-btn edit-btn" (click)="$event.stopPropagation(); editTask(task)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete-btn" (click)="$event.stopPropagation(); deleteTask(task.id)" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Tasks Section -->
      <div class="completed-section">
        <button 
          class="completed-toggle" 
          (click)="toggleCompletedSection()"
          [class.expanded]="isCompletedExpanded()"
          type="button">
          <div class="completed-header">
            <div class="completed-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              <span>Completed Tasks</span>
              <div class="completed-count">{{ getCompletedTaskCount() }}</div>
            </div>
            <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>
        </button>
        
        @if (isCompletedExpanded()) {
          <div class="completed-tasks">
          
              @for (task of getCompletedTasks(); track task.id) {
                <div class="completed-task-card" (click)="openTaskDetail(task)">
                  <div class="task-main">
                    <button 
                      class="task-checkbox completed" 
                      (click)="$event.stopPropagation(); toggleTaskCompletion(task)"
                      type="button">
                      <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </button>
                    <div class="task-content">
                      <h3 class="task-title completed">{{ task.task }}</h3>
                      @if (task.due) {
                        <div class="task-due">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {{ task.due | date:'MMM d' }}
                        </div>
                      }
                    </div>
                  </div>
                  <div class="task-actions">
                    <button class="action-btn edit-btn" (click)="$event.stopPropagation(); editTask(task)" type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" (click)="$event.stopPropagation(); deleteTask(task.id)" type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              }@empty {
                <div class="empty-completed">
                <p>No completed tasks yet</p>
              </div>
              }
            
          </div>
        }
      </div>
    </div>

    <!-- Task Creation Modal -->
    @if (isTaskModalOpen()) {
      <div class="modal-overlay" (click)="closeTaskModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Create New Task</h2>
            <button class="modal-close" (click)="closeTaskModal()" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label for="task-title">Task Title</label>
              <input 
                id="task-title"
                class="form-input"
                [(ngModel)]="modalTask.task"
                placeholder="Enter task title..."
                type="text"
                maxlength="100">
            </div>
            
            <div class="form-group">
              <label for="task-description">Description (Optional)</label>
              <textarea 
                id="task-description"
                class="form-textarea"
                [(ngModel)]="modalTask.description"
                placeholder="Add task description..."
                rows="3"
                maxlength="500"></textarea>
            </div>
            
            <div class="form-group">
              <label for="task-due">Due Date (Optional)</label>
              <input 
                id="task-due"
                class="form-input"
                [(ngModel)]="modalTask.due"
                type="date">
            </div>
            
            <div class="form-group">
              <label>Quadrant</label>
              <div class="quadrant-selector">
                <div class="quadrant-option" 
                     [class.selected]="modalTask.quadrant === 'important-urgent'"
                     (click)="modalTask.quadrant = 'important-urgent'">
                  <div class="option-icon do-color">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                  </div>
                  <span>Do First</span>
                </div>
                <div class="quadrant-option" 
                     [class.selected]="modalTask.quadrant === 'important-not-urgent'"
                     (click)="modalTask.quadrant = 'important-not-urgent'">
                  <div class="option-icon decide-color">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11H1v12h8V11z"/>
                      <path d="M23 11h-8v12h8V11z"/>
                      <path d="M11 1L5.5 7.5 11 14l5.5-6.5L11 1z"/>
                    </svg>
                  </div>
                  <span>Schedule</span>
                </div>
                <div class="quadrant-option" 
                     [class.selected]="modalTask.quadrant === 'not-important-urgent'"
                     (click)="modalTask.quadrant = 'not-important-urgent'">
                  <div class="option-icon delegate-color">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span>Delegate</span>
                </div>
                <div class="quadrant-option" 
                     [class.selected]="modalTask.quadrant === 'not-important-not-urgent'"
                     (click)="modalTask.quadrant = 'not-important-not-urgent'">
                  <div class="option-icon delete-color">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    </svg>
                  </div>
                  <span>Eliminate</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeTaskModal()" type="button">Cancel</button>
            <button class="btn-primary" (click)="createTask()" [disabled]="!modalTask.task.trim()" type="button">
              Create Task
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Task Detail Modal -->
    @if (selectedTask()) {
      <div class="modal-overlay" (click)="closeTaskDetail()">
        <div class="modal-content task-detail-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Task Details</h2>
            <button class="modal-close" (click)="closeTaskDetail()" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="task-detail-content">
              <div class="task-detail-header">
                <button 
                  class="task-checkbox-large" 
                  (click)="toggleTaskCompletion(selectedTask()!)"
                  [class.completed]="selectedTask()!.completed"
                  type="button">
                  <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </button>
                <div class="task-detail-title">
                  <h3 [class.completed]="selectedTask()!.completed">{{ selectedTask()!.task }}</h3>
                  <div class="task-quadrant-badge" [attr.data-quadrant]="selectedTask()!.quadrant">
                    {{ getQuadrantLabel(selectedTask()!.quadrant) }}
                  </div>
                </div>
              </div>
              
              @if (selectedTask()!.description) {
                <div class="task-detail-description">
                  <h4>Description</h4>
                  <p>{{ selectedTask()!.description }}</p>
                </div>
              }
              
              @if (selectedTask()!.due) {
                <div class="task-detail-due">
                  <h4>Due Date</h4>
                  <div class="due-date-display">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ selectedTask()!.due | date:'fullDate' }}
                  </div>
                </div>
              }
              
              <div class="task-detail-meta">
                <div class="meta-item">
                  <strong>Created:</strong> 
                  {{ selectedTask()!.created_at | date:'medium' }}
                </div>
                @if (selectedTask()!.updated_at !== selectedTask()!.created_at) {
                  <div class="meta-item">
                    <strong>Updated:</strong> 
                    {{ selectedTask()!.updated_at | date:'medium' }}
                  </div>
                }
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeTaskDetail()" type="button">Close</button>
            <button class="btn-secondary" (click)="editTask(selectedTask()!)" type="button">Edit</button>
            <button class="btn-danger" (click)="deleteTask(selectedTask()!.id)" type="button">Delete</button>
          </div>
        </div>
      </div>
    }

    <!-- Edit Task Modal -->
    @if (isEditModalOpen()) {
      <div class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Edit Task</h2>
            <button class="modal-close" (click)="closeEditModal()" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label for="edit-task-title">Task Title</label>
              <input 
                id="edit-task-title"
                class="form-input"
                [(ngModel)]="editingTask.task"
                placeholder="Enter task title..."
                type="text"
                maxlength="100">
            </div>
            
            <div class="form-group">
              <label for="edit-task-description">Description (Optional)</label>
              <textarea 
                id="edit-task-description"
                class="form-textarea"
                [(ngModel)]="editingTask.description"
                placeholder="Add task description..."
                rows="3"
                maxlength="500"></textarea>
            </div>
            
            <div class="form-group">
              <label for="edit-task-due">Due Date (Optional)</label>
              <input 
                id="edit-task-due"
                class="form-input"
                [(ngModel)]="editingTask.due"
                type="date">
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeEditModal()" type="button">Cancel</button>
            <button class="btn-primary" (click)="updateTask()" [disabled]="!editingTask.task.trim()" type="button">
              Update Task
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './tasks.component.css',
})

export class TasksComponent implements OnInit {
  // Signal-based state management
  private readonly _taskModalOpen = signal(false);
  private readonly _selectedTask = signal<Task | null>(null);
  private readonly _editModalOpen = signal(false);
  private readonly _completedExpanded = signal(false);

  // Public signals for template binding
  readonly isTaskModalOpen = this._taskModalOpen.asReadonly();
  readonly selectedTask = this._selectedTask.asReadonly();
  readonly isEditModalOpen = this._editModalOpen.asReadonly();
  readonly isCompletedExpanded = this._completedExpanded.asReadonly();

  // Services and data
  private readonly supabaseService = inject(SupabaseService);
  readonly tasks$ = this.supabaseService.tasks$;

  // Modal task form data
  modalTask: TaskInput = {
    task: '',
    description: '',
    due: null,
    quadrant: 'important-urgent'
  };

  // Edit task form data
  editingTask: Task = {
    id: '',
    task: '',
    description: '',
    completed: false,
    due: null,
    quadrant: '',
    created_at: '',
    updated_at: ''
  };

  // Computed properties for task categorization
  readonly tasksByQuadrant = computed(() => {
    const tasks = this.tasks$;
    return {
      'important-urgent': this.getTasksByQuadrant('important-urgent'),
      'important-not-urgent': this.getTasksByQuadrant('important-not-urgent'),
      'not-important-urgent': this.getTasksByQuadrant('not-important-urgent'),
      'not-important-not-urgent': this.getTasksByQuadrant('not-important-not-urgent')
    };
  });

  ngOnInit(): void {
    // Component initialization
  }

  // Task filtering methods
  getTasksByQuadrant(quadrant: string): Task[] {
    // Get current tasks synchronously from the observable
    let currentTasks: Task[] = [];
    this.tasks$.subscribe(tasks => currentTasks = tasks).unsubscribe();

    return currentTasks.filter(task =>
      task.quadrant === quadrant && !task.completed
    );
  }

  getCompletedTasks(): Task[] {
    let currentTasks: Task[] = [];
    this.tasks$.subscribe(tasks => currentTasks = tasks).unsubscribe();

    return currentTasks.filter(task => task.completed);
  }

  getTaskCount(quadrant: string): number {
    return this.getTasksByQuadrant(quadrant).length;
  }

  getCompletedTaskCount(): number {
    return this.getCompletedTasks().length;
  }

  // Modal management
  openTaskModal(quadrant: string): void {
    this.modalTask = {
      task: '',
      description: '',
      due: null,
      quadrant: quadrant
    };
    this._taskModalOpen.set(true);
  }

  closeTaskModal(): void {
    this._taskModalOpen.set(false);
    this.resetModalTask();
  }

  openTaskDetail(task: Task): void {
    this._selectedTask.set(task);
  }

  closeTaskDetail(): void {
    this._selectedTask.set(null);
  }

  openEditModal(): void {
    this._editModalOpen.set(true);
  }

  closeEditModal(): void {
    this._editModalOpen.set(false);
    this.resetEditingTask();
  }

  toggleCompletedSection(): void {
    this._completedExpanded.set(!this._completedExpanded());
  }

  // Task operations
  async createTask(): Promise<void> {
    if (!this.modalTask.task.trim()) {
      alert('Task title is required');
      return;
    }

    try {
      const { error } = await this.supabaseService.createTask(this.modalTask);
      if (error) {
        console.error('Error creating task:', error);
        alert('Error creating task: ' + error.message);
      } else {
        this.closeTaskModal();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('An unexpected error occurred while creating the task');
    }
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.closeTaskDetail();
    this.openEditModal();
  }

  async updateTask(): Promise<void> {
    if (!this.editingTask.task.trim()) {
      alert('Task title is required');
      return;
    }

    try {
      const { error } = await this.supabaseService.updateTask(this.editingTask);
      if (error) {
        console.error('Error updating task:', error);
        alert('Error updating task: ' + error.message);
      } else {
        this.closeEditModal();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('An unexpected error occurred while updating the task');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await this.supabaseService.deleteTask(taskId);
        this.closeTaskDetail();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('An unexpected error occurred while deleting the task');
      }
    }
  }

  async toggleTaskCompletion(task: Task): Promise<void> {
    try {
      if (task.completed) {
        await this.supabaseService.uncompleteTask(task.id);
      } else {
        await this.supabaseService.completeTask(task.id);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('An unexpected error occurred while updating the task');
    }
  }

  // Utility methods
  getQuadrantLabel(quadrant: string): string {
    const labels: { [key: string]: string } = {
      'important-urgent': 'Do First',
      'important-not-urgent': 'Schedule',
      'not-important-urgent': 'Delegate',
      'not-important-not-urgent': 'Eliminate'
    };
    return labels[quadrant] || 'Unknown';
  }

  private resetModalTask(): void {
    this.modalTask = {
      task: '',
      description: '',
      due: null,
      quadrant: 'important-urgent'
    };
  }

  private resetEditingTask(): void {
    this.editingTask = {
      id: '',
      task: '',
      description: '',
      completed: false,
      due: null,
      quadrant: '',
      created_at: '',
      updated_at: ''
    };
  }

  // Legacy methods for backward compatibility (preserved Supabase operations)
  async addTask(quadrant: QuadrantKey): Promise<void> {
    // This method is preserved for backward compatibility but not used in new UI
    const quadrantMap: { [key in QuadrantKey]: string } = {
      't1': 'important-urgent',
      't2': 'important-not-urgent',
      't3': 'not-important-urgent',
      't4': 'not-important-not-urgent'
    };

    const taskInput: TaskInput = {
      task: 'Legacy task',
      description: '',
      due: null,
      quadrant: quadrantMap[quadrant]
    };

    const { error } = await this.supabaseService.createTask(taskInput);
    if (error) {
      console.error('Error creating task:', error);
    }
  }

  clickEditTask(task: Task): void {
    // Legacy method preserved for backward compatibility
    this.editTask(task);
  }

  async completeTask(taskId: string): Promise<void> {
    // Legacy method preserved for backward compatibility
    await this.supabaseService.completeTask(taskId);
  }

  async uncompleteTask(taskId: string): Promise<void> {
    // Legacy method preserved for backward compatibility
    await this.supabaseService.uncompleteTask(taskId);
  }

  clearNewTask(): void {
    // Legacy method preserved for backward compatibility
  }

  clearEditTask(): void {
    // Legacy method preserved for backward compatibility
  }
}
