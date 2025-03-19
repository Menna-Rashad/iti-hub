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
  sessions: any[] = [];  // ✅ تأكيد أن `sessions` هو Array دائمًا
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // ✅ تأكيد وجود المدخلات باستخدام ViewChild
  @ViewChild('sessionTitle') sessionTitle?: ElementRef<HTMLInputElement>;
  @ViewChild('sessionDate') sessionDate?: ElementRef<HTMLInputElement>;
  @ViewChild('platform') platform?: ElementRef<HTMLSelectElement>;
  @ViewChild('mentorId') mentorId?: ElementRef<HTMLInputElement>;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.loadMentorSessions();
  }

  // ✅ تحميل جلسات الموجه
  loadMentorSessions(): void {
    this.isLoading = true;
    this.mentorshipService.getMentorSessions().subscribe(
      (data) => {
        console.log("📌 API Response:", data);  // ✅ طباعة الاستجابة في الـ console للتحقق من البيانات
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

  // ✅ إنشاء جلسة جديدة
  createSession(): void {
    // التحقق من وجود المدخلات المطلوبة
    if (!this.sessionTitle || !this.sessionDate || !this.platform) {
      console.error("❌ One or more form fields are not properly bound!");
      return;
    }
  
    // جلب البيانات من المدخلات
    const sessionTitle = this.sessionTitle.nativeElement.value.trim();
    let sessionDate = this.sessionDate.nativeElement.value.trim();
    const platform = this.platform.nativeElement.value.trim();
  
    // جلب الـ mentorId من localStorage
    const mentorId = localStorage.getItem('user_id');  // استخدام الـ mentorId المخزن في الـ localStorage
  
    if (!mentorId) {
      this.errorMessage = "⚠️ Missing mentorId in localStorage!";
      console.error("⚠️ mentorId is missing in localStorage.");
      return;
    }
  
    // التحقق من أن جميع الحقول ليست فارغة
    if (!sessionTitle || !sessionDate || !platform) {
      this.errorMessage = "⚠️ جميع الحقول مطلوبة!";
      console.error("⚠️ Missing required fields:", { sessionTitle, sessionDate, platform });
      return;
    }
  
    // تنسيق التاريخ ليكون متوافقًا مع الـ API
    sessionDate = sessionDate.replace("T", " ") + ":00";
  
    // إعداد البيانات لإرسالها
    const sessionData = {
      mentor_id: mentorId,  // استخدام mentorId الذي جلبناه من الـ localStorage
      session_title: sessionTitle,
      session_date: sessionDate,
      platform: platform
    };
  
    console.log("📡 Sending session data to backend:", sessionData);
  
    // إرسال البيانات إلى الـ API
    this.mentorshipService.createMentorship(sessionData).subscribe(
      (response) => {
        console.log("✅ Backend Response:", response);
        this.successMessage = "✅ Session created successfully!";
        this.loadMentorSessions();  // تحديث الجلسات بعد إنشاء الجلسة
      },
      (error) => {
        console.error("❌ Error Creating Session:", error);
        this.errorMessage = "❌ Failed to create session.";
      }
    );
  }
  
  
  // ✅ حذف جلسة
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

          // 🔥 إزالة الجلسة من القائمة مباشرة بدون إعادة تحميل الجلسات من الخادم
          this.sessions = this.sessions.filter(session => session.id !== sessionId);
        },
        (error) => {
          console.error("❌ Failed to delete session:", error);
          this.errorMessage = "❌ Failed to delete session.";
        }
      );
    }
  }

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
                // 🔥 Remove the session from the list without reloading the page
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
