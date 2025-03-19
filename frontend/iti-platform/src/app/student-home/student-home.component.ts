import { Component, OnInit } from '@angular/core';
import { MentorshipService } from '../services/mentorship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-home',
  imports:[CommonModule],
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  availableSessions: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadAvailableSessions();
  }

  loadAvailableSessions(): void {
    this.isLoading = true;
    this.mentorshipService.getAvailableMentorships().subscribe(
      (data) => {
        this.availableSessions = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'فشل في تحميل الجلسات';
        this.isLoading = false;
      }
    );
  }

  joinSession(sessionId: number): void {
    this.mentorshipService.markAsAttending(sessionId).subscribe(
      () => {
        alert('تم الانضمام للجلسة بنجاح ✅');
        this.loadAvailableSessions();
      },
      (error) => {
        this.errorMessage = 'تعذر الانضمام للجلسة';
      }
    );
  }
}
