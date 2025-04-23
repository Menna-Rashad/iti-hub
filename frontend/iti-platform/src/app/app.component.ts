import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
// import { MentorshipComponent } from './mentorship/mentorship.component'; // <-- Import the MentorshipComponent here
// import { BrowserModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'iti-hub';
}
