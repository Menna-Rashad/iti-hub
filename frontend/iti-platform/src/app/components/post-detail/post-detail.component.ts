import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    MatInputModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any;
  newComment = '';
  currentUserId: number = 0; // ✅ مضاف علشان نعرف مين صاحب البوست
  canEdit = false; // ✅ لتحديد هل المستخدم يقدر يعدل البوست

  constructor(
    private commentService: CommentService,
    private voteService: VoteService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id;

    this.route.params.subscribe(params => {
      this.loadPost(params['id']);
    });
  }

  loadPost(id: string) {
    this.api.getPost(id).subscribe(post => {
      this.post = post;
      const userId = localStorage.getItem('user_id');
      this.canEdit = userId !== null && post.user_id == userId;
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      this.commentService.addComment(this.post.id, {
        content: this.newComment
      }).subscribe({
        next: () => {
          this.loadPost(this.post.id);
          this.newComment = '';
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

  handleVote(target: 'post' | 'comment', id: string, type: 'upvote' | 'downvote') {
    this.voteService.handleVote(target, id, type).subscribe({
      next: (response: any) => {
        console.log('Vote response:', response);

        if (target === 'post') {
          this.post.upvotes = response.new_counts.upvotes;
          this.post.downvotes = response.new_counts.downvotes;
        } else {
          const comment = this.post.comments.find((c: any) => c.id === id);
          if (comment) {
            comment.upvotes = response.new_counts.upvotes;
            comment.downvotes = response.new_counts.downvotes;
          }
        }

        this.loadPost(this.post.id); 
      },
      error: (err) => console.error(err)
    });
  }

  goToEdit() {
    this.router.navigate(['/edit-post', this.post.id]); 
  }
}
