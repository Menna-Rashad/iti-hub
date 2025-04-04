import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ForumService } from '../services/forum.service';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    SidebarComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  selectedSort: string = 'newest';
  selectedCategoryId: number | null = null;
  categories: any[] = [];
  posts: any[] = [];
  currentPage: number = 1;
  perPage: number = 5;
  totalPages: number = 0;
  filteredPosts: any[] = [];
  loadingVotes: { [key: number]: boolean } = {};
  commentText: { [postId: number]: string } = {};
  loadingComments: { [postId: number]: boolean } = {};
  comments: { [postId: number]: any[] } = {};
  visibleComments: { [postId: number]: any[] } = {};
  currentUser: any = null;
  searchQuery = '';

  editingPostId: number | null = null;
  editPostTitle = '';
  editPostContent = '';

  @ViewChildren('lastVisibleComment', { read: ElementRef })
  lastCommentElements!: QueryList<ElementRef>;

  constructor(
    private forumService: ForumService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.getCurrentUser();
    this.loadCategories();
  }

  loadCategories(): void {
    this.forumService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => console.error(err),
    });
  }

  getCurrentUser(): void {
    this.forumService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res.user ?? res;
      },
      error: (err) => console.error(err),
    });
  }

  loadPosts(): void {
this.forumService.getPostsPaginated(
  this.currentPage,
  this.perPage,
  this.selectedSort,
  this.selectedCategoryId || undefined 
)
      .subscribe({
        next: (res) => {
          this.posts = res.data;
          this.filteredPosts = res.data;
          this.totalPages = res.last_page;
          res.data.forEach((post: any) => this.loadComments(post.id));
        },
        error: (err) => console.error(err),
      });
  }  
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPosts();
  }  

  loadComments(postId: number): void {
    this.loadingComments[postId] = true;
    this.forumService.getPost(postId.toString()).subscribe({
      next: (res) => {
        this.comments[postId] = res.comments;
        this.visibleComments[postId] = res.comments.slice(0, 3);
        this.loadingComments[postId] = false;
      },
      error: (err) => {
        this.loadingComments[postId] = false;
        console.error(err);
      },
    });
  }

  addComment(postId: number): void {
    const comment = this.commentText[postId]?.trim();
    if (!comment) return;
    this.forumService.createComment(postId, { content: comment }).subscribe({
      next: () => {
        this.commentText[postId] = '';
        this.loadComments(postId);
      },
      error: (err) => console.error(err),
    });
  }

  editComment(postId: number, comment: any): void {
    const newContent = prompt('✏️ Edit your comment:', comment.content);
    if (newContent && newContent.trim()) {
      this.forumService
        .updateComment(comment.id, { content: newContent.trim() })
        .subscribe({
          next: () => this.loadComments(postId),
          error: (err) => console.error(err),
        });
    }
  }

  deleteComment(postId: number, commentId: number): void {
    this.forumService.deleteComment(commentId).subscribe({
      next: () => this.loadComments(postId),
      error: (err) => console.error(err),
    });
  }

  vote(postId: number, voteType: 'upvote' | 'downvote'): void {
    this.loadingVotes[postId] = true;
    this.forumService
      .vote({
        target_type: 'post',
        target_id: postId,
        vote_type: voteType,
      })
      .subscribe({
        next: (res) => {
          const post = this.posts.find((p) => p.id === postId);
          if (post) {
            post.upvotes = res.upvotes;
            post.downvotes = res.downvotes;
          }
          this.loadingVotes[postId] = false;
        },
        error: (err) => {
          this.loadingVotes[postId] = false;
          console.error(err);
        },
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => this.loadPosts());
  }

  copyLink(postId: number): void {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => this.toastr.success('Link copied to clipboard ✅'))
      .catch(() => this.toastr.error('Failed to copy link ❌'));
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredPosts = this.posts;
      return;
    }
  
    this.filteredPosts = this.posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.category?.name?.toLowerCase().includes(query)
    );
  }  

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredPosts = this.posts;
  }

  // ✅ Post Actions
  editPost(post: any): void {
    const newTitle = prompt('📝 Edit post title:', post.title);
    const newContent = prompt('📝 Edit post content:', post.content);

    if (newTitle?.trim() && newContent?.trim()) {
      this.forumService
        .updatePost(post.id, {
          title: newTitle.trim(),
          content: newContent.trim(),
        })
        .subscribe({
          next: () => {
            this.loadPosts();
            this.toastr.success('Post updated successfully.');
          },
          error: () => this.toastr.error('Failed to update post.'),
        });
    }
  }

  deletePost(postId: number): void {
    if (confirm('🗑 Are you sure you want to delete this post?')) {
      this.forumService.deletePost(postId).subscribe({
        next: () => {
          this.loadPosts();
          this.toastr.success('Post deleted successfully.');
        },
        error: () => this.toastr.error('Failed to delete post.'),
      });
    }
  }
}
