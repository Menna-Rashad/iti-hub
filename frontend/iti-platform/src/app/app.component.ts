import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Import the LoginComponent so you can use its selector in your template.
  imports: [LoginComponent],
  template: '<app-login></app-login>',
  styles: []
})
export class AppComponent {}
