import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { VoteService } from '../../services/vote.service';
import { CommentService } from '../../services/comments.service';
import { AuthStateService } from '../../services/auth-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { VoteButtonsComponent } from '../../shared/components/vote-buttons/vote-buttons.component';
import { ActionMenuComponent } from '../../shared/components/action-menu/action-menu.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, take } from 'rxjs/operators';

interface Comment {
  id: number;
  content: string;
  user_id: number;
  user?: { name: string };
  created_at: string;
  upvotes: number;
  downvotes: number;
  current_user_vote: 'upvote' | 'downvote' | null;
}

@Component({
  selector: 'app-post-detail',
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
    VoteButtonsComponent,
    ActionMenuComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post: any;
  newComment = '';
  currentUserId: number = 0;
  canEdit = false;
  visibleComments: any[] = [];
  isAddingComment = false;
  isFollowing: boolean = false;
  defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random';

  constructor(
    private commentService: CommentService,
    private voteService: VoteService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authState: AuthStateService,
    private clipboard: Clipboard,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 Waiting for user...');
    this.authState.currentUser$
      .pipe(
        filter(user => !!user),
        take(1)
      )
      .subscribe(user => {
        this.currentUserId = user!.id;
        console.log('✅ Logged in user ID:', this.currentUserId);

        this.route.params.subscribe(params => {
          console.log('📦 Route param post ID:', params['id']);
          this.loadPost(params['id']);
        });
      });
  }

  loadPost(id: string) {
    console.log('📥 Fetching post with ID:', id);
    this.api.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        console.log('🧑‍💻 Post owner ID:', post.user_id);
        console.log('💡 currentUserId at post load:', this.currentUserId);

        post.comments?.forEach((comment: any, i: number) => {
          console.log(`💬 Comment ${i} by user ID:`, comment.user_id);
        });

        this.canEdit = post.user_id === this.currentUserId;
        this.isFollowing = post.is_following || false;
        this.visibleComments = post.comments?.slice(0, 3) || [];
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => console.error('Error loading post:', err)
    });
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
    console.log(this.isFollowing ? 'Followed' : 'Unfollowed');
    // TODO: Call API to follow/unfollow user if needed
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
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding comment:', err);
          this.isAddingComment = false;
        }
      });
  }

  showMoreComments() {
    this.visibleComments = this.post.comments || [];
    this.cdr.detectChanges();
  }

  onVoteUpdated(target: 'post' | 'comment', id: string, event: any) {
    if (target === 'post') {
      this.post.upvotes = event.newCounts.upvotes;
      this.post.downvotes = event.newCounts.downvotes;
      this.post.current_user_vote = event.currentVote;
    } else {
      const comment = this.post.comments.find((c: any) => c.id === id);
      if (comment) {
        comment.upvotes = event.newCounts.upvotes;
        comment.downvotes = event.newCounts.downvotes;
        comment.current_user_vote = event.currentVote;
      }
    }
    this.cdr.detectChanges();
  }

  goToEdit() {
    this.router.navigate(['/edit-post', this.post.id]);
  }

  onDeletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.api.deletePost(this.post.id).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
          console.log('Post deleted successfully');
        },
        error: (err: HttpErrorResponse) => console.error('Error deleting post:', err)
      });
    }
  }

  onReportPost(post: any) {
    console.log('Reporting post:', post);
    alert('Post reported for review');
    // TODO: Call API to report post
  }

  onHidePost(post: any) {
    console.log('Hiding post:', post);
    alert('Post hidden from view');
    // TODO: Call API to hide post
  }

  onEditComment(comment: Comment) {
    const newContent = prompt('Edit comment:', comment.content);
    if (newContent && newContent.trim()) {
      this.commentService.updateComment(comment.id, { content: newContent.trim() }).subscribe({
        next: () => {
          this.loadPost(this.post.id);
          console.log('Comment edited successfully');
        },
        error: (err: HttpErrorResponse) => console.error('Error editing comment:', err)
      });
    }
  }

  onDeleteComment(comment: Comment) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(comment.id).subscribe({
        next: () => {
          this.loadPost(this.post.id);
          console.log('Comment deleted successfully');
        },
        error: (err: HttpErrorResponse) => console.error('Error deleting comment:', err)
      });
    }
  }

  onReportComment(comment: any) {
    console.log('Reporting comment:', comment);
    alert('Comment reported for review');
    // TODO: Call API to report comment
  }

  onHideComment(comment: any) {
    console.log('Hiding comment:', comment);
    alert('Comment hidden from view');
    // TODO: Call API to hide comment
  }

  copyPost(post: any) {
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    this.clipboard.copy(postUrl);
    alert('Post link copied to clipboard!');
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