import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router'; // Import RouterModule to handle navigation

@Component({
  selector: 'app-sidebar',
  standalone: true, // This makes it a standalone component
  imports: [CommonModule, MatSidenavModule, MatListModule, RouterModule], // Import necessary modules
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // You can add any additional logic for the sidebar here
}
