import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipService } from '../services/mentorship.service';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css'],
  imports: [CommonModule], // ✅ Required for *ngFor
})
export class MentorshipComponent implements OnInit {
  sessions: any[] = [];

  @ViewChild('mentorId') mentorId!: ElementRef;
  @ViewChild('sessionDate') sessionDate!: ElementRef;
  @ViewChild('platform') platform!: ElementRef;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.getUserSessions();
  }

  bookSession() {
    const mentor_id = this.mentorId.nativeElement.value;
    let session_date = this.sessionDate.nativeElement.value;
    const platform = this.platform.nativeElement.value;
  
    if (!mentor_id || !session_date || !platform) {
      console.error('⚠️ Missing data! Please fill all fields.');
      return;
    }
  
    // ✅ Convert datetime-local (YYYY-MM-DDTHH:mm) to Laravel's expected format (Y-m-d H:i:s)
    session_date = session_date.replace("T", " ") + ":00"; // Convert 'T' to ' ' and append ":00"
  
    const data = {
      mentor_id: mentor_id,
      session_date: session_date,
      platform: platform
    };
  
    console.log('🟢 Sending formatted session data:', data);
  
    this.mentorshipService.bookSession(data).subscribe(
      response => {
        console.log('✅ Session booked successfully:', response);
        this.getUserSessions();
      },
      error => {
        console.error('🔴 Error booking session:', error);
      }
    );
  }

  getUserSessions() {
    this.mentorshipService.getUserSessions().subscribe(
      sessions => {
        this.sessions = sessions;
        console.log('📌 Fetched user sessions:', sessions);
      },
      error => {
        console.error('🔴 Error fetching sessions:', error);
      }
    );
  }

  cancelSession(id: number) {
    this.mentorshipService.cancelSession(id).subscribe(() => {
      console.log('🗑 Session cancelled');
      this.getUserSessions();
    });
  }

  rateSession(id: number) {
    const rating = prompt('Enter rating (1-5):');
    const feedback = prompt('Enter feedback:');

    if (!rating || !feedback) {
      console.error('⚠️ Rating and feedback are required.');
      return;
    }

    this.mentorshipService.rateSession(id, parseInt(rating), feedback).subscribe(() => {
      console.log('🌟 Session rated');
      this.getUserSessions();
    });
  }
}
