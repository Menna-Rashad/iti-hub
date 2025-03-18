import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
// import { MentorshipComponent } from './mentorship/mentorship.component'; // <-- Import the MentorshipComponent here
import { NavbarComponent } from './navbar/navbar.component'; // <-- Import the NavbarComponent here

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], // <-- Add the components you need
  template: `
  <app-navbar></app-navbar> <!-- This will display the Navbar -->
  <router-outlet></router-outlet> <!-- This will display the routed content -->
`,  // Use the login component in the template
  // styles: [],
  //  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'iti-hub';
}
