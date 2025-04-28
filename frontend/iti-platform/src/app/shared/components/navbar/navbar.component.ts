import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userImage: string = '';
  userName: string = '';
  isMenuOpen = false;
  isDarkMode = false;
  icon = '🌙';

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    // Apply saved dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  
    // Check the authentication status
    this.authState.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.fetchUser();
      } else {
        this.userImage = '';
        this.userName = '';
      }
    });
  
    // ✅ Listen for localStorage updates (زي لما نغير الصورة)
    window.addEventListener('storage', () => {
      this.fetchUser();
    });
  }
  

  fetchUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userImage = user.profile_picture
        ? `http://127.0.0.1:8000/profile_pictures/${user.profile_picture}?t=${new Date().getTime()}`
        : 'assets/user.png';
      this.userName = user.name || 'User';
    }
  }
  

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.authState.setLoggedIn(false);
    this.userImage = '';
    this.userName = '';
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this.router.navigate(['/login']); // Fixed login route
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Toggle Dark Mode
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.icon = this.isDarkMode ? '☀️' : '🌙';
  }

  ngAfterViewInit() {
    // You can remove this manual event binding, Angular already handles (click) in the template
  }
}
