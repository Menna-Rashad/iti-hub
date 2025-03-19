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
  sessions: any[] = [];  // ✅ Ensures `sessions` is always an array

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

  /** ✅ Create a mentorship session */
  async bookSession() {
    const title = this.sessionTitle.nativeElement.value.trim();
    let sessionDate = this.sessionDate.nativeElement.value.trim();
    const platform = this.platform.nativeElement.value.trim();

    if (!title || !sessionDate || !platform) {
      this.errorMessage = '⚠️ Please fill all fields!';
      return;
    }

    sessionDate = sessionDate.replace('T', ' ') + ':00'; // Format datetime

    const data = { session_title: title, session_date: sessionDate, platform };
    this.isLoading = true;
    this.errorMessage = ''; // Clear errors
    this.successMessage = ''; // Clear previous success message

    try {
      await this.mentorshipService.bookSession(data).toPromise();
      this.successMessage = '✅ Session booked successfully!';
      this.getUserSessions(); // Refresh sessions
    } catch (error) {
      this.errorMessage = '❌ Error booking session. Please try again later.';
      console.error('🔴 Booking Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /** ✅ Get user's scheduled mentorship sessions */
  async getUserSessions() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    try {
      const result = await this.mentorshipService.getUserSessions().toPromise();
      this.sessions = result || [];  // ✅ Default to an empty array if undefined
    } catch (error) {
      this.errorMessage = '❌ Error fetching sessions. Please try again later.';
      console.error('🔴 Fetch Sessions Error:', error);
      this.sessions = [];  // ✅ Ensures it's always an array
    } finally {
      this.isLoading = false;
    }
  }
  

  /** ❌ Cancel a mentorship session */
  async cancelSession(id: number) {
    if (!confirm('⚠️ Are you sure you want to cancel this session?')) return;

    this.isLoading = true;
    try {
      await this.mentorshipService.cancelSession(id).toPromise();
      this.successMessage = '✅ Session cancelled successfully!';
      this.getUserSessions(); // Refresh
    } catch (error) {
      this.errorMessage = '❌ Failed to cancel session.';
      console.error('🔴 Cancel Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /** 🗑 Delete a mentorship session */
  deleteSession(sessionId?: number): void {
    if (!sessionId) {
        console.error("❌ sessionId is undefined!");
        return;
    }

    if (confirm('⚠️ Are you sure you want to delete this session?')) {
        this.mentorshipService.cancelMentorship(sessionId).subscribe(
            () => {
                console.log("✅ Session deleted:", sessionId);
                this.successMessage = '✅ Session deleted successfully!';
                
                // 🔥 إزالة الجلسة من القائمة بدون إعادة تحميل الصفحة
                this.sessions = this.sessions.filter(session => session.id !== sessionId);
            },
            (error) => {
                console.error("❌ Failed to delete session:", error);
                this.errorMessage = '❌ Failed to delete session.';
            }
        );
    }
}


  /** ⭐ Rate a mentorship session */
  async rateSession(id: number) {
    const rating = prompt('🌟 Enter rating (1-5):');
    const feedback = prompt('📝 Enter feedback:');

    if (!rating || !feedback) {
      alert('⚠️ Rating and feedback are required.');
      return;
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      alert('⚠️ Rating must be between 1 and 5.');
      return;
    }

    this.isLoading = true;
    try {
      await this.mentorshipService.rateSession(id, parsedRating, feedback).toPromise();
      this.successMessage = '✅ Session rated successfully!';
      this.getUserSessions();
    } catch (error) {
      this.errorMessage = '❌ Failed to rate session.';
      console.error('🔴 Rating Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
