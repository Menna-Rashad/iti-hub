import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state.service';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationComponent } from '../../../notification/notification.component';

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
    MatDividerModule,
    RouterModule,
    NotificationComponent
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
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', this.isDarkMode);

    // تحقق من الـ token يدويًا عند الـ init
    const tokenExists = !!localStorage.getItem('auth_token');
    console.log('Initial token check:', tokenExists); // Debugging
    this.isLoggedIn = tokenExists;
    this.authState.setLoggedIn(tokenExists);

    // اشتراك في الـ isLoggedIn$
    this.authState.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      console.log('isLoggedIn updated to:', status); // Debugging
      if (status) {
        this.fetchUser();
      } else {
        this.userImage = '';
        this.userName = '';
      }
    });

    // تحديث المستخدم إذا كان مسجل دخول
    if (this.isLoggedIn) {
      this.fetchUser();
    }
  }

  fetchUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userImage = user.profile_picture
        ? `http://127.0.0.1:8000/profile_pictures/${user.profile_picture}?t=${new Date().getTime()}`
        : 'assets/user.png';
      this.userName = user.name || 'User';
      console.log('User fetched:', this.userName, this.userImage); // Debugging
    } else {
      this.userImage = '';
      this.userName = '';
      console.log('No user found in localStorage'); // Debugging
    }
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('notifications');
    
    // Update auth state
    this.authState.setLoggedIn(false);
    
    // Show snackbar
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    
    // Redirect to login page
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Force reload to ensure state is cleared
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.icon = this.isDarkMode ? '☀️' : '🌙';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.nav');
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}