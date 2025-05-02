import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import Chart from 'chart.js/auto';

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
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatTableModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})

export class StatisticsComponent implements OnInit, AfterViewInit {
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

  @ViewChild('usersChart') usersChart!: ElementRef;
  @ViewChild('postsChart') postsChart!: ElementRef;
  private charts: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Dummy data for testing
    this.stats = {
      users_count: 150,
      posts_count: 320,
      comments_count: 640,
      open_tickets_count: 25,
      closed_tickets_count: 75,
      tasks_count: 10,
      latest_users: [
        { id: 1, name: "John Doe", email: "john.doe@example.com", created_at: "2025-04-01T10:00:00Z" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", created_at: "2025-04-02T12:30:00Z" },
        { id: 3, name: "Alice Johnson", email: "alice.j@example.com", created_at: "2025-04-03T09:15:00Z" }
      ],
      latest_posts: [
        { id: 101, title: "Welcome to the Forum", created_at: "2025-04-01T08:00:00Z" },
        { id: 102, title: "How to Get Started", created_at: "2025-04-02T14:20:00Z" },
        { id: 103, title: "Community Guidelines", created_at: "2025-04-03T16:45:00Z" }
      ],
      latest_tickets: [
        { id: 201, title: "Login Issue", status: "open", created_at: "2025-04-01T11:00:00Z" },
        { id: 202, title: "Payment Error", status: "in_review", created_at: "2025-04-02T13:10:00Z" },
        { id: 203, title: "Feature Request", status: "closed", created_at: "2025-04-03T15:30:00Z" }
      ]
    };

    this.animateCount('userCount', this.stats.users_count);
    this.animateCount('postCount', this.stats.posts_count);
    this.animateCount('commentCount', this.stats.comments_count);
    this.animateCount('openTicketsCount', this.stats.open_tickets_count);
    this.calculateProgressBars();
  }

  ngAfterViewInit(): void {
    this.createCharts();
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

  createCharts() {
    if (this.usersChart && this.postsChart) {
      const ctxUsers = this.usersChart.nativeElement.getContext('2d');
      const ctxPosts = this.postsChart.nativeElement.getContext('2d');

      if (ctxUsers && ctxPosts) {
        // Destroy existing charts to avoid duplication
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];

        // Doughnut chart for User Statistics
        this.charts.push(new Chart(ctxUsers, {
          type: 'doughnut',
          data: {
            labels: ['Users', 'Placeholder'],
            datasets: [{
              data: [this.stats.users_count, 0], // Placeholder to make it look like a doughnut
              backgroundColor: ['rgba(52, 152, 219, 0.8)', 'rgba(0, 0, 0, 0)'],
              borderWidth: 1
            }]
          },
          options: {
            plugins: { legend: { position: 'bottom', labels: { color: '#2c3e50' } } },
            maintainAspectRatio: false,
            responsive: true
          }
        }));

        // Doughnut chart for Activity Overview (already a doughnut chart)
        this.charts.push(new Chart(ctxPosts, {
          type: 'doughnut',
          data: {
            labels: ['Posts', 'Comments', 'Open Tickets'],
            datasets: [{
              data: [this.stats.posts_count, this.stats.comments_count, this.stats.open_tickets_count],
              backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(52, 152, 219, 0.8)', 'rgba(241, 196, 15, 0.8)'],
              borderWidth: 1
            }]
          },
          options: {
            plugins: { legend: { position: 'bottom', labels: { color: '#2c3e50' } } },
            maintainAspectRatio: false,
            responsive: true
          }
        }));
      } else {
        console.error('Canvas context not found for charts');
      }
    } else {
      console.error('Chart canvas elements not found');
    }
  }

  ngOnDestroy() {
    this.charts.forEach(chart => chart.destroy());
  }
}