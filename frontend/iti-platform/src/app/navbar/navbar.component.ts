import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'; // Angular Material Toolbar
import { MatButtonModule } from '@angular/material/button'; // Angular Material Button
import { RouterModule } from '@angular/router'; // To use routerLink for navigation

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule], // Importing necessary Material modules and RouterModule
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/">ITI HUB</span> <!-- إضافة الرابط -->
      <span class="spacer"></span>
      <button mat-button routerLink="/api/jobs">Jobs</button>
      <button mat-button routerLink="/api/login">Login</button>
      <button mat-button routerLink="/register" class="register-btn">Register</button>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.css'] // Optional: If you want custom styling for the navbar
})
export class NavbarComponent {}
