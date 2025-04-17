import { Component, OnInit } from '@angular/core';
import { UserDashboardService } from '../../services/user-dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  dashboardData: any;
  newTask: string = '';

  constructor(private userDashboardService: UserDashboardService) {}

  ngOnInit(): void {
    this.userDashboardService.getDashboardData().subscribe({
      next: (data) => this.dashboardData = data,
      error: (error) => console.error('Dashboard load error', error)
    });
  }

  addTask() {
    const trimmed = this.newTask.trim();
    if (!trimmed) return;
  
    const newTask = {
      title: trimmed,
      status: 'pending'
    };
  
    this.userDashboardService.createTask(newTask).subscribe({
      next: (res) => {
        const createdTask = res.task;
  
        // Add UI fields manually
        createdTask.icon = 'radio_button_unchecked';
        createdTask.color = 'gray';
  
        this.dashboardData.tasks.push(createdTask);
        this.newTask = '';
      },
      error: (err) => console.error('Error creating task', err)
    });
  }
  

  toggleTask(task: any) {
    if (task.status === 'pending') {
      task.status = 'in_progress';
      task.icon = 'hourglass_empty';
      task.color = 'orange';
    } else if (task.status === 'in_progress') {
      task.status = 'completed';
      task.icon = 'check_circle';
      task.color = 'green';
    } else {
      task.status = 'pending';
      task.icon = 'radio_button_unchecked';
      task.color = 'gray';
    }
    task.updated_at = new Date();

    this.userDashboardService.updateTask(task).subscribe({
      next: () => console.log('Task status updated'),
      error: (err) => console.error('Error updating status', err)
    });
  }

  deleteTask(task: any) {
    const confirmed = confirm(`Are you sure you want to delete the task: "${task.title}"?`);
    if (!confirmed) return;

    this.userDashboardService.deleteTask(task.id).subscribe({
      next: () => {
        const index = this.dashboardData.tasks.indexOf(task);
        if (index > -1) this.dashboardData.tasks.splice(index, 1);
        console.log('Task deleted from backend');
      },
      error: err => {
        console.error('Error deleting task:', err);
      }
    });
  }

  saveTask(task: any) {
    const trimmedTitle = task.title?.trim();
    if (!trimmedTitle) {
      console.warn('Task title is empty');
      return;
    }

    task.title = trimmedTitle;
    task.isEditing = false;

    this.userDashboardService.updateTask(task).subscribe({
      next: () => console.log('Task updated successfully'),
      error: (err) => console.error('Update failed', err)
    });
  }
}
