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
import { TopContributorsComponent } from '../top-contributors/top-contributors.component';
import { VoteButtonsComponent } from '../shared/components/vote-buttons/vote-buttons.component';

// Define the Post interface
interface Post {
  id: number;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  current_user_vote: 'upvote' | 'downvote' | null;
  user_id: number;
  category_id?: number;
  category?: { name: string };
  tags?: string;
  media?: string[];
}

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
    VoteButtonsComponent,
    TopContributorsComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  loadingVotes: { [key: number]: boolean } = {};
  commentText: { [postId: number]: string } = {};
  loadingComments: { [postId: number]: boolean } = {};
  comments: { [postId: number]: any[] | undefined } = {};
  visibleComments: { [postId: number]: any[] } = {};
  currentUser: any = null;
  searchQuery = '';
  categories: any[] = [];
  selectedCategory: string = '';
  categoryColors: string[] = [];
  topContributors: any[] = [];

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
    this.getTopContributors();
    this.loadCategories();
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
    this.forumService.getPosts().subscribe({
      next: (res: Post[]) => {
        this.posts = res.map((post: Post) => ({
          ...post,
          current_user_vote: post.current_user_vote || null,
        }));
        this.filteredPosts = this.posts;
        res.forEach((post: Post) => this.loadComments(post.id));
      },
      error: (err) => console.error(err),
    });
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

  editPost(post: Post): void {
    const newTitle = prompt('📝 Edit post title:', post.title);
    const newContent = prompt('📝 Edit post content:', post.content);

    if (newTitle?.trim() && newContent?.trim()) {
      const formData = new FormData();
      formData.append('title', newTitle.trim());
      formData.append('content', newContent.trim());
      formData.append('category_id', post.category_id?.toString() || '');
      formData.append('tags', post.tags || '');
      formData.append('existing_media', JSON.stringify(post.media || []));
      formData.append('_method', 'PUT');

      this.forumService.updatePost(post.id, formData).subscribe({
        next: () => {
          this.loadPosts();
          this.toastr.success('✔️ Post updated successfully.');
        },
        error: () => this.toastr.error('❌ Failed to update post.'),
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

  getTopContributors(): void {
    this.forumService.getTopContributors().subscribe({
      next: (res) => {
        this.topContributors = res.users_with_scores;
      },
      error: (err) => console.error('Error fetching top contributors:', err),
    });
  }

  loadCategories(): void {
    this.forumService.getCategories().subscribe((response) => {
      this.categories = response;
      this.categoryColors = this.generateRandomColors(this.categories.length);
    });
  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
      colors.push(randomColor);
    }
    return colors;
  }

  filterPosts(category: any): void {
    if (category) {
      this.filteredPosts = this.posts.filter(
        (post) => post.category_id === category.id
      );
    } else {
      this.filteredPosts = this.posts;
    }
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

  // Placeholder stubs to override errors in template
  addComment(_: number) {}
  editComment(_: number, __: any) {}
  deleteComment(_: number, __: number) {}
  onVoteUpdated(_: number, __: any) {}
}
