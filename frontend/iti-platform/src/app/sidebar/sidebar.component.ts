import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router'; // Import Router and RouterModule to handle navigation
import { AuthStateService } from '../services/auth-state.service'; // Import AuthStateService
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-sidebar',
  standalone: true, // This makes it a standalone component
  imports: [CommonModule, MatMenuModule ,MatSidenavModule, MatListModule, RouterModule ,MatIconModule, MatBadgeModule], // Import necessary modules
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isLoggedIn: boolean = false;
  userName: string = '';
  userImage: string = '';

  constructor(private router: Router, private authState: AuthStateService) {}

  ngOnInit(): void {
    this.authState.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.fetchUserInfo();
      }
    });
  }

  fetchUserInfo(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userImage = user.profile_picture
        ? `http://127.0.0.1:8000/profile_pictures/${user.profile_picture}`
        : 'assets/user.png'; // Default profile picture if no image
      this.userName = user.name || 'User';
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.authState.setLoggedIn(false); 
    this.router.navigate(['/login']); 
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']); 
  }

  navigateToForum(): void {     
    this.router.navigate(['/forum']); 
  }    
  navigateToDashboard(): void {
    this.router.navigate(['/user/dashboard']); // تأكد من مسار التنقل الصحيح
  }
  
  navigateToChat(): void {
    this.router.navigate(['/chat']);
  }
  
  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }
  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }
  navigateToContributors(): void {
      
    this.router.navigate(['/top-contributors']);
}
  navigateToAbout(): void {
    this.router.navigate(['/about']);

  }
  navigateToForumView(): void {
    this.router.navigate(['/forum-view']);
  }
  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

}