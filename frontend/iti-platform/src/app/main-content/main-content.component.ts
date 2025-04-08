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
  category?: { name: string };
  // Add other fields as needed
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
          current_user_vote: post.current_user_vote || null // Ensure this field exists
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

  // ... rest of your methods (addComment, editComment, etc.) remain unchanged ...
}