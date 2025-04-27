import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  created_at: string;
}

interface Ticket {
  id: number;
  title: string;
  status: string;
  created_at: string;
}
@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  
})

export class StatisticsComponent implements OnInit {
  userCount: number = 0;
postCount: number = 0;
commentCount: number = 0;
openTicketsCount: number = 0;
openTicketsPercentage: number = 0;
commentsPerPostsPercentage: number = 0;

  stats: {
    users_count: number;
    posts_count: number;
    comments_count: number;
    open_tickets_count: number;
    closed_tickets_count: number;
    tasks_count: number;
    latest_users: User[];
    latest_posts: Post[];
    latest_tickets: Ticket[];
  } = {
    users_count: 0,
    posts_count: 0,
    comments_count: 0,
    open_tickets_count: 0,
    closed_tickets_count: 0,
    tasks_count: 0,
    latest_users: [],
    latest_posts: [],
    latest_tickets: []
  };
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAdminDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.animateCount('userCount', this.stats.users_count);
        this.animateCount('postCount', this.stats.posts_count);
        this.animateCount('commentCount', this.stats.comments_count);
        this.animateCount('openTicketsCount', this.stats.open_tickets_count);
        this.calculateProgressBars();

      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      }
    });
  
  }
animateCount(property: 'userCount' | 'postCount' | 'commentCount' | 'openTicketsCount', target: number) {
  let current = 0;
  const increment = Math.ceil(target / 50); 
  const interval = setInterval(() => {
    if (current < target) {
      current += increment;
      if (current > target) current = target;
      this[property] = current;
    } else {
      clearInterval(interval);
    }
  }, 20); 
}
calculateProgressBars() {
  const totalTickets = this.stats.open_tickets_count + this.stats.closed_tickets_count;
  this.openTicketsPercentage = totalTickets > 0
    ? Math.round((this.stats.open_tickets_count / totalTickets) * 100)
    : 0;

    this.commentsPerPostsPercentage = this.stats.posts_count > 0
    ? Math.min(Math.round((this.stats.comments_count / this.stats.posts_count) * 100), 100)
    : 0;
  
}

}