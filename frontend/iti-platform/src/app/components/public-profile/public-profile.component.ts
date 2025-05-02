import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FollowStateService } from '../../services/follow-state.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  user: any;
  isFollowing = false;
  followers: any[] = [];
  following: any[] = [];
  isOwnProfile = false;

  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private route: ActivatedRoute,
    private http: HttpClient,
    private followState: FollowStateService
  ) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('auth_token')
      })
    };
  }

  ngOnInit(): void {
    const userId = this.data.userId;
    // if (!id) reeturn;
  
    // const userId = Number(id);
    const currentUserId = Number(localStorage.getItem('user_id'));
  
    this.isOwnProfile = userId === currentUserId;
  
    // تحميل بيانات المستخدم
    this.http.get(`http://127.0.0.1:8000/api/users/${userId}`).subscribe({
      next: (res: any) => {
        this.user = res;
        this.user.profile_picture = this.user.profile_picture
          ? `http://127.0.0.1:8000/profile_pictures/${this.user.profile_picture}`
          : this.defaultAvatar;
      },
      error: (err) => console.error('Error loading user profile:', err)
    });
  
    if (!this.isOwnProfile) {
      this.followState.getObservable(userId).subscribe(status => {
        this.isFollowing = status;
      });
  
      if (!this.followState.getObservable(userId).value) {
        this.http.get(`http://127.0.0.1:8000/api/users/${userId}/status`, this.authHeaders())
          .subscribe({
            next: (res: any) => {
              const isFollowing = res?.is_following || res?.status === 'following';
              this.followState.set(userId, isFollowing);
            },
            error: () => {
              this.followState.set(userId, false);
            }
          });
      }
    }
    
  
    this.http.get(`http://127.0.0.1:8000/api/users/${userId}/followers`).subscribe((res: any) => {
      this.followers = res;
    });
  
    this.http.get(`http://127.0.0.1:8000/api/users/${userId}/following`).subscribe((res: any) => {
      this.following = res;
    });
  }
  toggleFollow(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
  
    const userId = Number(id);
    const url = this.isFollowing
      ? `http://127.0.0.1:8000/api/users/${userId}/unfollow`
      : `http://127.0.0.1:8000/api/users/${userId}/follow`;
  
    this.http.post(url, {}, this.authHeaders()).subscribe(() => {
      const newStatus = !this.isFollowing;
      this.followState.set(userId, newStatus); // ✅ تحديث الحالة المشتركة
    });
  }
  
  
}