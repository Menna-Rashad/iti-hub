import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthStateService } from './services/auth-state.service'; // ✅ استيراد الـ service

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
export class AppComponent implements OnInit {
  title = 'iti-hub';

  constructor(private authState: AuthStateService) {}

  ngOnInit(): void {
    this.authState.loadUserFromStorage(); // ✅ تحميل اليوزر عند بدء التطبيق
  }
}
