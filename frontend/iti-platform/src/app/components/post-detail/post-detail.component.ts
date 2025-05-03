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
import { MatMenuModule } from '@angular/material/menu';
import { Clipboard } from '@angular/cdk/clipboard';
import { VoteButtonsComponent } from '../../shared/components/vote-buttons/vote-buttons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CopyButtonComponent } from '../../shared/components/copy-button/copy-button.component';
import { FollowService } from '../../services/follow.service';
import { FollowStateService } from '../../services/follow-state.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatMenuModule,
    VoteButtonsComponent,
    MatTooltipModule,
    CopyButtonComponent
  ]
})
export class PostDetailComponent implements OnInit {
  post: any;
  newComment = '';
  currentUserId: number = 0;
  canEdit = false;
  visibleComments: any[] = [];
  selectedVote: string | null = null;
  isVoting = false;
  isAddingComment = false;
  isFollowing = false;
  showHoverProfile: boolean = false;
  maxVisibleComments = 4;


  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random';

  constructor(
    private commentService: CommentService,
    private voteService: VoteService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private forumService: ForumService,
    private clipboard: Clipboard,
    private followService: FollowService,
    private followState: FollowStateService,
    private toastr: ToastrService
  ) {}

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
      post.user.profile_picture = post.user?.profile_picture
        ? `http://127.0.0.1:8000/profile_pictures/${post.user.profile_picture}`
        : this.defaultAvatar;

      this.post = post;

      const userId = Number(localStorage.getItem('user_id'));
      this.currentUserId = userId;
      this.canEdit = post.user?.id === userId;

      const targetUserId = this.post.user.id;

      // ✅ الاستماع لأي تحديث مباشر لحالة المتابعة
      this.followState.getObservable(targetUserId).subscribe(status => {
        this.isFollowing = status;
      });

      // ✅ تحميل حالة المتابعة من الـ backend عند أول مرة فقط
      if (!this.followState.getObservable(targetUserId).value) {
        this.followService.checkStatus(targetUserId).subscribe({
          next: (res) => {
            const isFollowing = res?.is_following || false;
            this.followState.set(targetUserId, isFollowing);
          },
          error: () => {
            this.followState.set(targetUserId, false);
          }
        });
      }

      // التصويت للبوست
      if (!this.post.current_user_vote) {
        this.post.current_user_vote = null;
      }

      // التصويت لكل تعليق
      if (this.post.comments?.length) {
        this.post.comments.forEach((comment: any) => {
          if (!comment.current_user_vote) {
            comment.current_user_vote = null;
          }
        });
      }
      this.visibleComments = this.post.comments.slice(0, this.maxVisibleComments);

    });
  }

  toggleFollow() {
    const userId = this.post.user.id;
  
    const action = this.isFollowing
      ? this.followService.unfollow(userId)
      : this.followService.follow(userId);

    action.subscribe({
      next: () => {
        const newStatus = !this.isFollowing;
        this.followState.set(userId, newStatus);
        this.toastr.success(newStatus ? 'Followed' : 'Unfollowed'); // استبدال alert برسالة toastr
      },
      error: () => {
        this.toastr.error(' Failed to update follow status.'); // استبدال alert برسالة toastr
      }
    });
  }

  onVoteUpdated(event: {
    targetType: 'post' | 'comment';
    targetId: number;
    newCounts: { upvotes: number; downvotes: number };
    action: 'added' | 'removed';
  }) {
    if (event.targetType === 'post' && this.post?.id === event.targetId) {
      this.post.upvotes = event.newCounts.upvotes;
      this.post.downvotes = event.newCounts.downvotes;
    }
  }

  onCommentVoteUpdated(comment: any, event: {
    targetType: 'post' | 'comment';
    targetId: number;
    newCounts: { upvotes: number; downvotes: number };
    action: 'added' | 'removed';
  }) {
    if (event.targetType === 'comment' && event.targetId === comment.id) {
      comment.upvotes = event.newCounts.upvotes;
      comment.downvotes = event.newCounts.downvotes;
    }
  }

  selectVote(vote: string): void {
    this.selectedVote = vote === this.selectedVote ? null : vote;
  }

  showMoreComments() {
    this.visibleComments = [...this.post.comments]; 
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.isAddingComment = true;
    this.commentService.addComment(this.post.id, { content: this.newComment })
      .subscribe({
        next: () => {
          this.loadPost(this.post.id);
          this.newComment = '';
          this.isAddingComment = false;
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          this.toastr.error('Error adding comment.'); 
          this.isAddingComment = false;
        }
      });
  }
  editComment(comment: any): void {
    const newContent = prompt('Edit your comment:', comment.content);
    if (newContent && newContent.trim()) {
      this.commentService.updateComment(comment.id, { content: newContent.trim() })
      .subscribe({
        next: () => {
          comment.content = newContent.trim(); 
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error(err),
      });
    
    }
  }
  
  deleteComment(commentId: number): void {
    if (confirm(' Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => this.loadPost(this.post.id),
        error: (err) => {
          console.error(err);
          this.toastr.error('Error deleting comment.'); 
        },
      });
    }
  }
  
  handleVote(target: 'post' | 'comment', id: string, type: 'upvote' | 'downvote') {
    this.isVoting = true;
    this.voteService.handleVote(target, id, type).subscribe({
      next: (response: any) => {
        if (target === 'post') {
          this.post.upvotes = response.new_counts.upvotes || this.post.upvotes;
          this.post.downvotes = response.new_counts.downvotes || this.post.downvotes;
        } else {
          const comment = this.post.comments.find((c: any) => c.id === id);
          if (comment) {
            comment.upvotes = response.new_counts.upvotes || comment.upvotes;
            comment.downvotes = response.new_counts.downvotes || comment.downvotes;
          }
        }
        this.isVoting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating vote:', err);
        this.toastr.error('Error updating vote.'); 
        this.isVoting = false;
      }
    });
  }

  goToEdit() {
    this.router.navigate(['/posts/edit', this.post.id]);
  }

  deletePost() {
    this.api.deletePost(this.post.id).subscribe({
      next: () => this.router.navigate(['/community']),
      error: (err) => {
        this.toastr.error('Error deleting post:', err); 
      }

    });
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

  copyPost(post: any) {
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    this.clipboard.copy(postUrl);
    this.toastr.success('Post link copied to clipboard!');
  }
  
}
