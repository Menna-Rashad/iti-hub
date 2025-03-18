import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MentorshipService } from '../services/mentorship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorship',
  imports: [CommonModule],
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css'],
})
export class MentorshipComponent implements OnInit {
  sessions: any[] = [];
  isLoading: boolean = false;  // For loading spinner
  errorMessage: string = '';  // For error message
  successMessage: string = '';  // For success message

  @ViewChild('mentorId') mentorId!: ElementRef;
  @ViewChild('sessionDate') sessionDate!: ElementRef;
  @ViewChild('platform') platform!: ElementRef;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.getUserSessions();
  }

  // 🟢 Book a mentorship session
  async bookSession() {
    const mentorId = this.mentorId.nativeElement.value;
    let sessionDate = this.sessionDate.nativeElement.value;
    const platform = this.platform.nativeElement.value;

    // Validation
    if (!mentorId || !sessionDate || !platform) {
      alert('⚠️ Please fill all fields!');
      return;
    }

    sessionDate = sessionDate.replace("T", " ") + ":00";  // Convert 'T' to ' ' and append ":00"

    const data = { mentor_id: mentorId, session_date: sessionDate, platform };

    this.isLoading = true;  // Start loading spinner

    try {
      console.log('🟢 Sending session data:', data);
      const response = await this.mentorshipService.bookSession(data).toPromise();
      console.log('✅ Session booked successfully:', response);
      this.successMessage = 'Session booked successfully!';  // Show success message
      this.getUserSessions();  // Refresh sessions
    } catch (error) {
      console.error('🔴 Error booking session:', error);
      this.errorMessage = 'Error booking session. Please try again later.';  // Show error message
    } finally {
      this.isLoading = false;  // Stop loading spinner
    }
  }

  // 🟢 Get the user's scheduled sessions
  getUserSessions() {
    this.isLoading = true;  // Show loading spinner

    this.mentorshipService.getUserSessions().subscribe(
      (sessions) => {
        this.sessions = sessions;
        console.log('📌 Fetched user sessions:', sessions);
      },
      (error) => {
        console.error('🔴 Error fetching sessions:', error);
        this.errorMessage = 'Error fetching sessions. Please try again later.';
      },
      () => {
        this.isLoading = false;  // Hide loading spinner
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
