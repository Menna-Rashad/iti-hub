import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MentorshipService } from '../services/mentorship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {
  sessions: any[] = [];  // ✅ Array for mentor sessions
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // ✅ Input fields
  @ViewChild('sessionTitle') sessionTitle?: ElementRef<HTMLInputElement>;
  @ViewChild('sessionDate') sessionDate?: ElementRef<HTMLInputElement>;
  @ViewChild('platform') platform?: ElementRef<HTMLSelectElement>;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadMentorSessions();
  }

  // ✅ Load mentor sessions
  loadMentorSessions(): void {
    this.isLoading = true;
    this.mentorshipService.getMentorSessions().subscribe(
      (data) => {
        console.log("📌 API Response:", data);
        this.sessions = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      (error) => {
        console.error("❌ Error Fetching Sessions:", error);
        this.errorMessage = '❌ Failed to load sessions.';
        this.isLoading = false;
      }
    );
  }

  // ✅ Create a new session
  createSession(): void {
    if (!this.sessionTitle || !this.sessionDate || !this.platform) {
      console.error("❌ Missing input fields!");
      return;
    }

    const sessionTitle = this.sessionTitle.nativeElement.value.trim();
    let sessionDate = this.sessionDate.nativeElement.value.trim();
    const platform = this.platform.nativeElement.value.trim();

    const mentorId = localStorage.getItem('user_id');

    if (!mentorId) {
      this.errorMessage = "⚠️ Missing mentorId in localStorage!";
      console.error("⚠️ mentorId is missing in localStorage.");
      return;
    }

    if (!sessionTitle || !sessionDate || !platform) {
      this.errorMessage = "⚠️ All fields are required!";
      console.error("⚠️ Missing required fields:", { sessionTitle, sessionDate, platform });
      return;
    }

    // ✅ Format session date correctly
    const formattedDate = new Date(sessionDate).toISOString().slice(0, 19).replace("T", " ");

    const sessionData = {
      mentor_id: mentorId,
      session_title: sessionTitle,
      session_date: formattedDate,  // ✅ Use formatted date
      platform: platform
    };

    console.log("📡 Sending session data to backend:", sessionData);

    this.mentorshipService.createMentorship(sessionData).subscribe(
      (response) => {
        console.log("✅ Session created:", response);
        this.successMessage = "✅ Session created successfully!";
        this.loadMentorSessions();
      },
      (error) => {
        console.error("❌ API Error:", error);
        this.errorMessage = error.error?.message || "❌ Failed to create session.";
      }
    );
  }

  // ✅ Delete a session
  deleteSession(sessionId?: number): void {
    if (!sessionId) {
      console.error("❌ sessionId is undefined!");
      return;
    }

    if (confirm('⚠️ Are you sure you want to delete this session?')) {
      this.mentorshipService.cancelMentorship(sessionId).subscribe(
        () => {
          console.log("✅ Session deleted:", sessionId);
          this.successMessage = "✅ Session deleted successfully!";
          this.sessions = this.sessions.filter(session => session.id !== sessionId);
        },
        (error) => {
          console.error("❌ Failed to delete session:", error);
          this.errorMessage = "❌ Failed to delete session.";
        }
      );
    }
  }

  // ✅ Cancel a session
  cancelSession(sessionId: number): void {
    if (!sessionId) {
        console.error("❌ sessionId is undefined!");
        return;
    }

    if (confirm('⚠️ Are you sure you want to cancel this session?')) {
        this.mentorshipService.cancelSession(sessionId).subscribe(
            () => {
                console.log("✅ Session cancelled:", sessionId);
                this.successMessage = "✅ Session cancelled successfully!";
                this.sessions = this.sessions.filter(session => session.id !== sessionId);
            },
            (error) => {
                console.error("❌ Failed to cancel session:", error);
                this.errorMessage = "❌ Failed to cancel session.";
            }
        );
    }
  }
}
