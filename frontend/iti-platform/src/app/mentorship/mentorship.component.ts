import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MentorshipService } from '../services/mentorship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorship',
  imports:[CommonModule],
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css'],
})
export class MentorshipComponent implements OnInit {
  sessions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild('sessionTitle') sessionTitle!: ElementRef;
  @ViewChild('sessionDate') sessionDate!: ElementRef;
  @ViewChild('platform') platform!: ElementRef;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.getUserSessions();
  }

  // Create a mentorship session
  async bookSession() {
    const title = this.sessionTitle.nativeElement.value;
    let sessionDate = this.sessionDate.nativeElement.value;
    const platform = this.platform.nativeElement.value;

    if (!title || !sessionDate || !platform) {
      alert('⚠️ Please fill all fields!');
      return;
    }

    sessionDate = sessionDate.replace("T", " ") + ":00";

    const data = { session_title: title, session_date: sessionDate, platform };

    this.isLoading = true;

    try {
      const response = await this.mentorshipService.bookSession(data).toPromise();
      this.successMessage = 'Session booked successfully!';
      this.getUserSessions();
    } catch (error) {
      this.errorMessage = 'Error booking session. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  // Get user's scheduled sessions
  getUserSessions() {
    this.isLoading = true;
    this.mentorshipService.getUserSessions().subscribe(
      (sessions) => {
        this.sessions = sessions;
      },
      (error) => {
        this.errorMessage = 'Error fetching sessions. Please try again later.';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // 🟠 Cancel a mentorship session
  cancelSession(id: number) {
    const confirmCancel = confirm('Are you sure you want to cancel this session?');
    if (confirmCancel) {
      this.mentorshipService.cancelSession(id).subscribe(() => {
        console.log('🗑 Session cancelled');
        this.getUserSessions();  // Refresh sessions
      });
    }
  }

  // 🗑 Delete a mentorship session
  deleteSession(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this session?');
    if (confirmDelete) {
      this.mentorshipService.deleteSession(id).subscribe(
        (response) => {
          console.log('🗑 Session deleted successfully');
          this.getUserSessions();  // Refresh sessions after deletion
        },
        (error) => {
          console.error('🔴 Error deleting session:', error);
          alert('Failed to delete session. Please try again later.');
        }
      );
    }
  }

  // ⭐ Rate a mentorship session
  rateSession(id: number) {
    const rating = prompt('Enter rating (1-5):');
    const feedback = prompt('Enter feedback:');

    if (!rating || !feedback) {
      alert('⚠️ Rating and feedback are required.');
      return;
    }

    if (parseInt(rating) < 1 || parseInt(rating) > 5) {
      alert('⚠️ Rating must be between 1 and 5.');
      return;
    }

    this.mentorshipService.rateSession(id, parseInt(rating), feedback).subscribe(() => {
      console.log('🌟 Session rated');
      this.getUserSessions();  // Refresh sessions
    });
  }
}
