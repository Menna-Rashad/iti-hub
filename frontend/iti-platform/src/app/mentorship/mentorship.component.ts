import { Component, OnInit } from '@angular/core';
import { MentorshipService } from '../services/mentorship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorship',
  imports: [CommonModule],
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css'],
})
export class MentorshipComponent implements OnInit {
  availableSessions: any[] = []; // ✅ List of available sessions
  userSessions: any[] = []; // ✅ Sessions the user is attending
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  /** ✅ Load all sessions */
  async loadSessions() {
    this.isLoading = true;
    await Promise.all([this.getAvailableSessions(), this.getUserSessions()]);
    this.isLoading = false;
  }

  /** ✅ Get available mentorship sessions */
  async getAvailableSessions() {
    try {
      const result = await this.mentorshipService.getAvailableMentorships().toPromise();
      this.availableSessions = result || [];
    } catch (error) {
      this.errorMessage = '❌ Failed to fetch available sessions.';
      console.error('🔴 Fetch Available Sessions Error:', error);
    }
  }

  /** ✅ Get sessions the user is attending */
  /** ✅ Mark interest in a session */
  async setInterest(sessionId: number, status: string) {
    this.isLoading = true;
    try {
      await this.mentorshipService.setInterestStatus(sessionId, status).toPromise();
  
      // Update the available sessions dynamically
      if (status === 'interested') {
        const session = this.availableSessions.find(s => s.id === sessionId);
        if (session) {
          this.userSessions.push(session); // Move session to userSessions
          this.availableSessions = this.availableSessions.filter(s => s.id !== sessionId);
        }
      } else {
        this.availableSessions = this.availableSessions.filter(s => s.id !== sessionId);
      }
  
      this.getUserSessions(); // Refresh user sessions list
      this.showSuccess(`Session marked as "${status.replace('_', ' ')}"!`);
    } catch (error) {
      this.showError('Failed to update interest status.');
      console.error('Interest Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
/** ✅ Load sessions */
async getUserSessions() {
  this.isLoading = true;
  try {
      const result = await this.mentorshipService.getUserSessions().toPromise();
      this.userSessions = result || []; // Re-fetch user sessions from the API
  } catch (error) {
      this.showError('❌ Failed to fetch user sessions.');
      console.error('🔴 Fetch User Sessions Error:', error);
  } finally {
      this.isLoading = false;
  }
}

  /** ✅ Mark session as attending */
async markAsAttending(sessionId: number) {
  this.isLoading = true;
  try {
      // إرسال الطلب إلى الـ API لتحديث الحضور
      await this.mentorshipService.markAsAttending(sessionId).toPromise();
      this.showSuccess('✅ Marked as attending successfully!');
      this.getUserSessions();  // إعادة تحميل الجلسات المحجوزة للمستخدم
  } catch (error) {
      this.showError('❌ Failed to mark as attending.');
      console.error('🔴 Attendance Error:', error);
  } finally {
      this.isLoading = false;
  }
}

  /** ✅ Cancel session */
async cancelSession(sessionId: number) {
  if (!confirm('⚠️ Are you sure you want to cancel this session?')) return;

  this.isLoading = true;
  try {
      // إرسال طلب الإلغاء إلى الـ API
      await this.mentorshipService.cancelSession(sessionId).toPromise();
      this.userSessions = this.userSessions.filter(s => s.id !== sessionId);  // إزالة الجلسة من قائمة الجلسات المحجوزة
      this.showSuccess('✅ Session cancelled successfully!');
  } catch (error) {
      this.showError('❌ Failed to cancel session.');
      console.error('🔴 Cancel Error:', error);
  } finally {
      this.isLoading = false;
  }
}

  /** ✅ Rate session */
async rateSession(sessionId: number) {
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
      // إرسال التقييم إلى الـ API
      await this.mentorshipService.rateSession(sessionId, parsedRating, feedback).toPromise();
      this.showSuccess('✅ Session rated successfully!');
      this.getUserSessions();  // إعادة تحميل الجلسات المحجوزة
  } catch (error) {
      this.showError('❌ Failed to rate session.');
      console.error('🔴 Rating Error:', error);
  } finally {
      this.isLoading = false;
  }
}

  /** ✅ Show success messages */
  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  /** ❌ Show error messages */
  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}
