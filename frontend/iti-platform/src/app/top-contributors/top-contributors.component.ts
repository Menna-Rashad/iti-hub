import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { CommonModule } from '@angular/common'; // تأكد من استيراد CommonModule
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top-contributors',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-contributors.component.html',
  styleUrls: ['./top-contributors.component.css']
})
export class TopContributorsComponent implements OnInit {
  topContributors: any[] = [];

  constructor(private forumService: ForumService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadTopContributors();
  }

  loadTopContributors(): void {
    this.forumService.getTopContributors().subscribe({
      next: (res) => {
        if (res && res.users_with_scores) {
          this.topContributors = res.users_with_scores.map((contributor: { profile_picture?: string; points?: number }) => ({
            ...contributor,
            score: contributor.points || 0 // التأكد من وجود النقاط أو تعيينها كـ 0 إذا لم تكن موجودة
          }));
        } else {
          this.toastr.error('Failed to load data');
        }
      },
      error: (err: any) => {
        console.error('Error fetching top contributors:', err);
        this.toastr.error('An error occurred while loading the contributors list');
      }
    });
  }

  // دالة لتحميل الصورة من الـ URL أو تحميل صورة افتراضية في حال عدم وجود صورة
  getProfilePictureUrl(contributor: any): string {
    return contributor.profile_picture
      ? `http://127.0.0.1:8000/profile_pictures/${contributor.profile_picture}`  // عرض الصورة من السيرفر
      : 'assets/user.png';  // صورة افتراضية
  }
}
