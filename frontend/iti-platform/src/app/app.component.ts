import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MentorshipComponent } from './mentorship/mentorship.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, 

  ], 
  template: '<app-login></app-login>',  
  styles: [],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iti-hub';
}
