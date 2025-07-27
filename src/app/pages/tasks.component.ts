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
            @if(task.quadrant === 'important-urgent') {
              <div class="task-item" [class.completed]="task.completed">
                <h3>{{ task.task }}</h3>
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
            @if(task.quadrant === 'important-not-urgent') {
              <div class="task-item" [class.completed]="task.completed">
                <h3>{{ task.task }}</h3>
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
            @if(task.quadrant === 'not-important-urgent') {
              <div class="task-item" [class.completed]="task.completed">
                <h3>{{ task.task }}</h3>
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
            @if(task.quadrant === 'not-important-not-urgent') {
              <div class="task-item" [class.completed]="task.completed">
                <h3>{{ task.task }}</h3>
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
    }
    .task-item > h3{
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
  `]
})

export class TasksComponent implements OnInit {
  newTask: { t1: TaskInput, t2: TaskInput, t3: TaskInput, t4: TaskInput } = {
    t1: { task: '', description: '', due: null, quadrant: 'important-urgent' },
    t2: { task: '', description: '', due: null, quadrant: 'important-not-urgent' },
    t3: { task: '', description: '', due: null, quadrant: 'not-important-urgent' },
    t4: { task: '', description: '', due: null, quadrant: 'not-important-not-urgent' }
  };

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

  clearNewTask() {
    this.newTask = {
      t1: { task: '', description: '', due: null, quadrant: 'important-urgent' },
      t2: { task: '', description: '', due: null, quadrant: 'important-not-urgent' },
      t3: { task: '', description: '', due: null, quadrant: 'not-important-urgent' },
      t4: { task: '', description: '', due: null, quadrant: 'not-important-not-urgent' }
    }
  }
}
