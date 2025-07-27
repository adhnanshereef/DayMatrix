import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { QuadrantKey, Task, TaskInput } from '../interfaces/tasks';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, AsyncPipe, DatePipe],
  template: `
    <div class="page-container">
      <h1 class="page-title">Tasks</h1>
      <div class="quadrants">
        <div class="quadrant">
        <div class="task-list">  
        @for(task of tasks$ | async; track task.id) {
            @if(task.quadrant === 'important-urgent' && !task.completed ) {
              <div class="task-item" [class.completed]="task.completed">
                <div class="task-header">
                  <h3>{{ task.task }}</h3>
                  <div class="task-dropdown">
                    <button class="dropdown-toggle" type="button" tabindex="0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-color)" stroke-width="2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item edit" (click)="clickEditTask(task)" >Edit</button>
                      <button class="dropdown-item delete" (click)="deleteTask(task.id)">Delete</button>
                      <button class="dropdown-item delete" (click)="completeTask(task.id)">Completed</button>
                    </div>
                  </div>
                </div>
                @if(task.description) {
                  <p class="task-des" >{{ task.description }}</p>
                }
                @if(task.due) {
                  <p class="task-due" >Due: {{ task.due | date }}</p>
                }
              </div>
            }
          }
        </div>
          <div class="add-task">
            <input class="add-input" (keyup.enter)="addTask('t1')" [(ngModel)]="newTask.t1.task"  type="text" placeholder="Add a task..." />
            <input class="add-due" [(ngModel)]="newTask.t1.due" type="date" />
          </div>
        </div>
        <div class="quadrant">
        <div class="task-list"> 
        @for(task of tasks$ | async; track task.id) {
            @if(task.quadrant === 'important-not-urgent' && !task.completed ) {
              <div class="task-item" [class.completed]="task.completed">
                <div class="task-header">
                  <h3>{{ task.task }}</h3>
                  <div class="task-dropdown">
                    <button class="dropdown-toggle" type="button" tabindex="0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-color)" stroke-width="2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item edit" (click)="clickEditTask(task)" >Edit</button>
                      <button class="dropdown-item delete" (click)="deleteTask(task.id)">Delete</button>
                      <button class="dropdown-item delete" (click)="completeTask(task.id)">Completed</button>
                    </div>
                  </div>
                </div>
                @if(task.description) {
                  <p class="task-des" >{{ task.description }}</p>
                }
                @if(task.due) {
                  <p class="task-due" >Due: {{ task.due | date }}</p>
                }
              </div>
            }
          }
        </div>
          <div class="add-task">
            <input class="add-input" (keyup.enter)="addTask('t2')" [(ngModel)]="newTask.t2.task"  type="text" placeholder="Add a task..." />
            <input class="add-due" [(ngModel)]="newTask.t2.due" type="date" />
          </div>
        </div>
        <div class="quadrant">
        <div class="task-list">  
        @for(task of tasks$ | async; track task.id) {
            @if(task.quadrant === 'not-important-urgent' && !task.completed ) {
              <div class="task-item" [class.completed]="task.completed">
                <div class="task-header">
                  <h3>{{ task.task }}</h3>
                  <div class="task-dropdown">
                    <button class="dropdown-toggle" type="button" tabindex="0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-color)" stroke-width="2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item edit" (click)="clickEditTask(task)" >Edit</button>
                      <button class="dropdown-item delete" (click)="deleteTask(task.id)">Delete</button>
                      <button class="dropdown-item delete" (click)="completeTask(task.id)">Completed</button>
                    </div>
                  </div>
                </div>
                @if(task.description) {
                  <p class="task-des" >{{ task.description }}</p>
                }
                @if(task.due) {
                  <p class="task-due" >Due: {{ task.due | date }}</p>
                }
              </div>
            }
          }
        </div>
          <div class="add-task">
            <input class="add-input" (keyup.enter)="addTask('t3')" [(ngModel)]="newTask.t3.task"  type="text" placeholder="Add a task..." />
            <input class="add-due" [(ngModel)]="newTask.t3.due" type="date" />
          </div>
        </div>
        <div class="quadrant">
        <div class="task-list">  
        @for(task of tasks$ | async; track task.id) {
            @if(task.quadrant === 'not-important-not-urgent' && !task.completed ) {
              <div class="task-item" [class.completed]="task.completed">
                <div class="task-header">
                  <h3>{{ task.task }}</h3>
                  <div class="task-dropdown">
                    <button class="dropdown-toggle" type="button" tabindex="0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-color)" stroke-width="2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item edit" (click)="clickEditTask(task)" >Edit</button>
                      <button class="dropdown-item delete" (click)="deleteTask(task.id)">Delete</button>
                      <button class="dropdown-item delete" (click)="completeTask(task.id)">Completed</button>
                    </div>
                  </div>
                </div>
                @if(task.description) {
                  <p class="task-des" >{{ task.description }}</p>
                }
                @if(task.due) {
                  <p class="task-due" >Due: {{ task.due | date }}</p>
                }
              </div>
            }
          }
        </div>
          <div class="add-task">
            <input class="add-input" (keyup.enter)="addTask('t4')" [(ngModel)]="newTask.t4.task"  type="text" placeholder="Add a task..." />
            <input class="add-due" [(ngModel)]="newTask.t4.due" type="date" />
          </div>
        </div>
      </div>
      <div class="center">
        <div class="quadrant">
        <h3>Completed Tasks</h3>
      <div class="task-list">  
      @for(task of tasks$ | async; track task.id) {
          @if(task.completed) {
            <div class="task-item" [class.completed]="task.completed">
              <div class="task-header">
                <h3>{{ task.task }}</h3>
                <div class="task-dropdown">
                  <button class="dropdown-toggle" type="button" tabindex="0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-color)" stroke-width="2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                  </button>
                  <div class="dropdown-menu">
                    <button class="dropdown-item edit" (click)="clickEditTask(task)" >Edit</button>
                    <button class="dropdown-item delete" (click)="deleteTask(task.id)">Delete</button>
                    <button class="dropdown-item delete" (click)="uncompleteTask(task.id)">Not Completed</button>
                  </div>
                </div>
              </div>
              @if(task.description) {
                <p class="task-des" >{{ task.description }}</p>
              }
              @if(task.due) {
                <p class="task-due" >Due: {{ task.due | date }}</p>
              }
            </div>
          }
        }
      </div>
        
      </div>
      </div>
      @if(editTask) {
        <div class="edit-task-container">
        <div class="add-task">
            <input class="add-input" (keyup.enter)="updateTask()" [(ngModel)]="editTask.task"  type="text" placeholder="Add a task..." />
            <input class="add-due" [(ngModel)]="editTask.due" type="date" />
        </div>
      </div>
      }

    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px 0px;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--text-color);
    }
    .page-title {
      font-size: 4rem;
      text-align: center;
      margin-bottom: 20px;
    }
    .quadrants {
      margin: 20px 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .quadrant {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: var(--card-bg);
      border: 3px dotted var(--border-color);
      padding: 20px;
      border-radius: 8px;
      box-shadow: var(--shadow-color);
    }

    .center .quadrant{
      width: 90%;
    }

    .task-list{
      min-height: 200px;
      max-height: 45vh;
      overflow-y: auto;
      padding: 0 5px;
    }

    .task-item {
      background: var(--surface-color);
      border: 2px solid var(--border-color);
      padding: 5px 12px;
      border-radius: 8px;
      box-shadow: var(--shadow-color);
      margin-bottom: 15px;
      backdrop-filter: blur(5px);
      z-index: 0;
    }
    .task-item  h3{
      font-size: 1rem;
      font-weight: 300;
      letter-spacing: 0.75px;
      color: var(--primary-color);
    }
    .task-des{
      font-size: 0.75rem;
      padding: 1px 4px;
      border-left: 4px solid var(--border-color);
      font-weight: 100;
      color: var(--text-secondary);
    }
    .task-due {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .add-task {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 15px;
      background: var(--surface-color);
      box-shadow: var(--box-shadow);
    }
    .add-input {
      margin: 0;
      padding: 5px;
      background: transparent;
      border: none;
      border-right: 2px solid var(--border-color);
      outline: none;
      width: 77%;
      color: var(--text-primary);
    }
    .add-due{
      margin: 0;
      padding: 5px;
      background: transparent;
      border: none;
      outline: none;
      width: 23%;
      color: var(--text-primary);
    }
    .task-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .task-dropdown {
      position: relative;
    }

    .edit-task-container {
      position: fixed;
      bottom: 40px;
      display: flex;
      justify-content: center;
      padding: 0 40px;
      width: 100%;
    }
    .edit-task-container .add-task{
      width: 100%;
    }

    .dropdown-toggle {
      background: rgba(255,255,255,0.18);
      border: none;
      border-radius: 50%;
      padding: 4px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: background 0.2s;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dropdown-toggle:focus,
    .dropdown-toggle:hover {
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    }
    .dropdown-menu {
      z-index: 1;
      position: absolute;
      top: 28px;
      right: 0;
      min-width: 110px;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.13);
      border: 1px solid rgba(28,95,120,0.18);
      display: none;
      flex-direction: column;
      gap: 2px;
      padding: 8px 0;
    }
    .task-dropdown:focus-within .dropdown-menu,
    .task-dropdown:hover .dropdown-menu {
      display: flex;
    }
    .dropdown-item {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.95rem;
      padding: 8px 18px;
      text-align: left;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s, color 0.2s;
    }
    .dropdown-item.edit {
      color: #04b0adff;
    }
    .dropdown-item.delete {
      color: var(--accent-color);
    }
    .dropdown-item:hover {
      background: var(--glass-bg);
      color: #fff;
    }
    @media (max-width: 768px) {
      .dropdown-menu {
        min-width: 90px;
        top: 24px;
        right: 0;
        padding: 6px 0;
      }
      .dropdown-item {
        font-size: 0.85rem;
        padding: 7px 12px;
      }
    }
    @media (max-width: 480px) {
      .dropdown-menu {
        min-width: 80px;
        top: 20px;
        right: 0;
        padding: 4px 0;
      }
      .dropdown-item {
        font-size: 0.8rem;
        padding: 6px 8px;
      }
    }
  `]
})

export class TasksComponent implements OnInit {
  newTask: { t1: TaskInput, t2: TaskInput, t3: TaskInput, t4: TaskInput } = {
    t1: { task: '', description: '', due: null, quadrant: 'important-urgent' },
    t2: { task: '', description: '', due: null, quadrant: 'important-not-urgent' },
    t3: { task: '', description: '', due: null, quadrant: 'not-important-urgent' },
    t4: { task: '', description: '', due: null, quadrant: 'not-important-not-urgent' }
  };
  editTask: Task | undefined;

  tasks$: Observable<Task[]>;
  private readonly supabaseService = inject(SupabaseService);

  async addTask(quadrant: QuadrantKey) {
    const currentQuadrant: TaskInput = this.newTask[quadrant];

    if (!currentQuadrant.task) {
      alert('Task cannot be empty');
      return;
    }
    if (!currentQuadrant.quadrant) {
      alert('Please select a quadrant');
      return;
    }
    const { error } = await this.supabaseService.createTask(currentQuadrant);
    if (error) {
      console.error('Error creating task:', error);
    } else {
      this.clearNewTask();
    }

  }

  constructor() {
    this.tasks$ = this.supabaseService.tasks$;
  }

  ngOnInit(): void {
    // Any additional initialization logic can go here
  }

  clickEditTask(task: Task) {
    this.editTask = task;
  }

  async updateTask() {
    if (!this.editTask) {
      alert('No task selected for editing');
      return;
    }

    const { error } = await this.supabaseService.updateTask(this.editTask);
    if (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + error.message);
    } else {
      this.clearEditTask();
    }
  }

  deleteTask(taskId: string) {
    this.supabaseService.deleteTask(taskId)
  }

  clearNewTask() {
    this.newTask = {
      t1: { task: '', description: '', due: null, quadrant: 'important-urgent' },
      t2: { task: '', description: '', due: null, quadrant: 'important-not-urgent' },
      t3: { task: '', description: '', due: null, quadrant: 'not-important-urgent' },
      t4: { task: '', description: '', due: null, quadrant: 'not-important-not-urgent' }
    }
  }
  clearEditTask() {
    this.editTask = undefined;
  }

  async completeTask(taskId: string) {
    await this.supabaseService.completeTask(taskId);
  }

  async uncompleteTask(taskId: string) {
    await this.supabaseService.uncompleteTask(taskId);
  }

}
