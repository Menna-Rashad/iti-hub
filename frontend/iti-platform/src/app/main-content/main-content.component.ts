import {
  Component, OnInit, AfterViewInit,
  ElementRef, ViewChildren, QueryList
} from '@angular/core';

import { ForumService } from '../services/forum.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SidebarComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  posts: any[] = [];
  loadingVotes: { [key: number]: boolean } = {};
  commentText: { [postId: number]: string } = {};
  loadingComments: { [postId: number]: boolean } = {};
  comments: { [postId: number]: any[] } = {};
  currentUser: any = null;
  visibleComments: { [postId: number]: any[] } = {};


  @ViewChildren('lastVisibleComment', { read: ElementRef }) lastCommentElements!: QueryList<ElementRef>;
  observer: IntersectionObserver | null = null;
  
  constructor(
    private dialog: MatDialog,
    private forumService: ForumService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.forumService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('✅ currentUser Response:', res);

        // 👇 حاول جرب ده حسب شكل الـ API عندك
        this.currentUser = res.user ?? res;

        console.log('✅ currentUser Stored:', this.currentUser);
      },
      error: (err) => console.error('❌ Error fetching user', err)
    });
  }

  loadPosts(): void {
    this.forumService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
        res.forEach((post: any) => this.loadComments(post.id));
      },
      error: (err) => console.error(err)
    });
  }

  loadComments(postId: number): void {
    this.loadingComments[postId] = true;
    this.forumService.getPost(postId.toString()).subscribe({
      next: (res) => {
        this.comments[postId] = res.comments;
        // عرض أول 3 فقط
        this.visibleComments[postId] = res.comments.slice(0, 3);
        this.loadingComments[postId] = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.loadingComments[postId] = false;
      }
    });
  }
  loadMoreComments(postId: number): void {
    const currentLength = this.visibleComments[postId]?.length || 0;
    const nextComments = this.comments[postId].slice(currentLength, currentLength + 3);
    this.visibleComments[postId] = [
      ...(this.visibleComments[postId] || []),
      ...nextComments
    ];
  }
    

  addComment(postId: number): void {
    const comment = this.commentText[postId]?.trim();
    if (!comment) return;

    this.forumService.createComment(postId, { content: comment })
    .subscribe({
      next: () => {
        this.commentText[postId] = '';
        this.loadComments(postId); // Refresh
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });  
  }

  editComment(postId: number, comment: any): void {
    const newContent = prompt('✏️ Edit your comment:', comment.content);
    if (newContent && newContent.trim()) {
      this.forumService.updateComment(comment.id, { content: newContent.trim() }).subscribe({
        next: () => this.loadComments(postId),
        error: (err) => console.error('❌ Error editing comment:', err)
      });
    }
  }

  deleteComment(postId: number, commentId: number): void {
    this.forumService.deleteComment(commentId).subscribe({
      next: () => this.loadComments(postId),
      error: (err) => console.error('❌ Error deleting comment:', err)
    });
  }

  vote(postId: number, voteType: 'upvote' | 'downvote') {
    this.loadingVotes[postId] = true;

    this.forumService.vote({
      target_type: 'post',
      target_id: postId,
      vote_type: voteType
    }).subscribe({
      next: (res) => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.upvotes = res.upvotes;
          post.downvotes = res.downvotes;
        }
        this.loadingVotes[postId] = false;
      },
      error: (err) => {
        console.error('❌ Error voting:', err);
        this.loadingVotes[postId] = false;
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPosts(); // refresh
    });
  }

  copyLink(postId: number): void {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(link)
      .then(() => this.toastr.success('Link copied to clipboard ✅'))
      .catch(() => this.toastr.error('Failed to copy link ❌'));
  }
  
  // ngAfterViewInit(): void {
  //   this.lastCommentElements.changes.subscribe(() => {
  //     this.posts.forEach(post => {
  //       const visible = this.visibleComments[post.id]?.length || 0;
  //       const total = this.comments[post.id]?.length || 0;
  //       if (visible < total) {
  //         this.observeLastComment(post.id);
  //       }
  //     });
  //   });
  // }
  // observeLastComment(postId: number): void {
  //   const last = this.lastCommentElements?.last;
  //   if (!last) return;
  
  //   if (this.observer) this.observer.disconnect();
  
  //   this.observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       this.loadMoreComments(postId);
  //     }
  //   });
  
  //   this.observer.observe(last.nativeElement);
  // }
    
}
