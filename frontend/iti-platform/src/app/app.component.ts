import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { MentorshipComponent } from './mentorship/mentorship.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent, FormsModule, MentorshipComponent], // <-- Add the components you need
  template: '<app-login></app-login>',  // Use the login component in the template
  styles: [],
   templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'iti-hub';
}
