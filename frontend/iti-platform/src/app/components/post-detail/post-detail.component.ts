import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { VoteService } from '../../services/vote.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../../services/comments.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ForumService } from '../../services/forum.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ],
})

export class PostDetailComponent implements OnInit {
  post: any;
  newComment = '';
  currentUserId: number = 0;
  canEdit = false;
  visibleComments: any[] = [];  // لتخزين التعليقات التي سيتم عرضها
  selectedVote: string | null = null;

  isVoting = false;
  isAddingComment = false;

  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random';

  constructor(
    private commentService: CommentService,
    private voteService: VoteService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadPost(id);
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadPost(id);
  }

  loadPost(id: string) {
    this.api.getPost(id).subscribe(post => {
      this.post = post;
      const userId = localStorage.getItem('user_id');
      this.canEdit = userId !== null && post.user_id == userId;

      // عند تحميل البوست، ابدأ بعرض 3 تعليقات فقط
      this.visibleComments = post.comments?.slice(0, 3);
    });
  }

  selectVote(vote: string): void {
    this.selectedVote = vote === this.selectedVote ? null : vote;  // تغيير حالة الزر
  }
  
  // دالة لعرض المزيد من التعليقات
  showMoreComments() {
    // عرض المزيد من التعليقات (على سبيل المثال: إظهار جميع التعليقات)
    this.visibleComments = this.post.comments;
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.isAddingComment = true;
    this.commentService.addComment(this.post.id, {
      content: this.newComment
    }).subscribe({
      next: () => {
        this.loadPost(this.post.id);
        this.newComment = '';
        this.isAddingComment = false;
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.isAddingComment = false;
      }
    });
  }

  handleVote(target: 'post' | 'comment', id: string, type: 'upvote' | 'downvote') {
    this.isVoting = true;
  
    this.voteService.handleVote(target, id, type).subscribe({
      next: (response: any) => {
        if (target === 'post') {
          // تحديث التصويت للـ Post مباشرة في واجهة المستخدم
          this.post.upvotes = response.new_counts.upvotes || this.post.upvotes;
          this.post.downvotes = response.new_counts.downvotes || this.post.downvotes;
        } else {
          const comment = this.post.comments.find((c: any) => c.id === id);
          if (comment) {
            // تحديث التصويت للـ Comment مباشرة
            comment.upvotes = response.new_counts.upvotes || comment.upvotes;
            comment.downvotes = response.new_counts.downvotes || comment.downvotes;
          }
        }
  
        // تأكد من التحديث الفوري للواجهة
        this.isVoting = false;
        this.cdr.detectChanges(); // هذا سيجعل Angular يتعرف على التغييرات التي حدثت.
      },
      error: (err) => {
        console.error('Error updating vote:', err);
        this.isVoting = false;
      }
    });
  }
  
  

  goToEdit() {
    this.router.navigate(['/posts/edit', this.post.id]);
  }

  isImage(file: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
  }

  isVideo(file: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(file);
  }

  isAudio(file: string): boolean {
    return /\.(mp3|wav|ogg)$/i.test(file);
  }

  isDocument(file: string): boolean {
    return /\.(pdf|doc|docx|ppt|pptx|zip)$/i.test(file);
  }
}
