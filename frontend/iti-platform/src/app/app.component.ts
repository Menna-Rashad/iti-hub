import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
   
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {}

  get showNavbar(): boolean {
    const currentPath = this.router.url.split('?')[0].replace(/\/$/, ''); // remove query params and trailing slash
    return !['/login', '/register'].includes(currentPath);
  }
}
