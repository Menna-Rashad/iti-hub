import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
// import { MentorshipComponent } from './mentorship/mentorship.component'; // <-- Import the MentorshipComponent here
import { NavbarComponent } from './navbar/navbar.component'; // <-- Import the NavbarComponent here

// import { BrowserModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'iti-hub';
}
