import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { Task } from '../interfaces/tasks';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, AsyncPipe],
  template: `
    <div class="page-container">
      <h1>Tasks</h1>
      <p>Task management coming soon...</p>
      <form (submit)="addTask()" >
        <input type="text" [(ngModel)]="newTask.task" name="task" placeholder="Task" required />
        <input type="text" [(ngModel)]="newTask.description" name="description" placeholder="Description" required />
        <input type="date" [(ngModel)]="newTask.due" name="due" placeholder="Due Date" />
        <select [(ngModel)]="newTask.quadrant" name="quadrant">
          <option value="important-urgent">Important & Urgent</option>
          <option value="important-not-urgent">Important & Not Urgent</option>
          <option value="not-important-urgent">Not Important & Urgent</option>
          <option value="not-important-not-urgent">Not Important & Not Urgent</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
            <!-- Tasks list -->
      <div class="tasks-list">
        @for(task of tasks$ | async; track task.id) {
        <div

          class="task-item"
          [class.completed]="task.completed">
          
          <div class="task-content">
            <h3>task title: {{ task.task }}</h3>
            <p>{{ task.description }}</p>
          </div>

          <!-- <div class="task-actions">
            <button 
              (click)="toggleTask(task.id!, task.completed!)"
              [class.completed]="task.completed">
              {{ task.completed ? 'Undo' : 'Complete' }}
            </button>
            <button (click)="startEdit(task)">Edit</button>
            <button (click)="deleteTask(task.id!)" class="delete">Delete</button>
          </div> -->
        </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 120px 20px 40px;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--text-color);
    }
  `]
})
export class TasksComponent implements OnInit {
  newTask: { task: string, description: string, due: Date | null, quadrant: string } = {
    task: '',
    description: '',
    due: null,
    quadrant: 'important-urgent'
  };

  tasks$: Observable<Task[]>;
  private readonly supabaseService = inject(SupabaseService);

  async addTask() {
    if(!this.newTask.task){
      alert('Task cannot be empty');
      return;
    }
    if(!this.newTask.quadrant){
      alert('Please select a quadrant');
      return;
    }
    const { error } = await this.supabaseService.createTask(this.newTask);
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
    this.newTask = { task: '', description: '', due: null, quadrant: 'important-urgent' };
  }
}
