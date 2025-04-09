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
import { AuthStateService } from '../../services/auth-state.service';
import { VoteButtonsComponent } from '../../shared/components/vote-buttons/vote-buttons.component';
import { ActionMenuComponent } from '../../shared/components/action-menu/action-menu.component';
import { filter, take } from 'rxjs/operators';

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
    VoteButtonsComponent,
    ActionMenuComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any;
  newComment = '';
  currentUserId: number = 0;
  canEdit = false;

  constructor(
    private commentService: CommentService,
    private voteService: VoteService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authState: AuthStateService
  ) {}

  // ngOnInit() {
  //   this.authState.currentUser$
  //     .pipe(
  //       filter(user => !!user),  // استنى لحد ما ييجي يوزر فعلاً
  //       take(1)                  // خده مرة واحدة بس
  //     )
  //     .subscribe(user => {
  //       this.currentUserId = user!.id;
  
  //       this.route.params.subscribe(params => {
  //         this.loadPost(params['id']);
  //       });
  //     });
  // }
  
  ngOnInit() {
    console.log('🔄 Waiting for user...');
    this.authState.currentUser$
      .pipe(
        filter(user => !!user),  // استنى لما يبقى فيه يوزر
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

  // loadPost(id: string) {
  //   this.api.getPost(id).subscribe(post => {
  //     this.post = post;
  
  //     // 3. دلوقتي نقدر نتحقق من الصلاحية
  //     this.canEdit = post.user_id === this.currentUserId;
  //   });
  // }

  // loadPost(id: string) {
  //   this.api.getPost(id).subscribe(post => {
  //     this.post = post;
  
  //     console.log('✅ Current user ID:', this.currentUserId);
  //     console.log('🧑‍💻 Post owner ID:', post.user_id);
  
  //     // optional: اطبعي برضو الكومنتات لو حابة تتأكدي
  //     post.comments.forEach((comment: any, i: number) => {
  //       console.log(`💬 Comment ${i} by user ID:`, comment.user_id);
  //     });
  
  //     this.canEdit = this.currentUserId !== 0 && post.user_id == this.currentUserId;
  //   });
  // }
  
  loadPost(id: string) {
    console.log('📥 Fetching post with ID:', id);
  
    this.api.getPost(id).subscribe(post => {
      this.post = post;
  
      console.log('🧑‍💻 Post owner ID:', post.user_id);
      console.log('💡 currentUserId at post load:', this.currentUserId);
  
      post.comments.forEach((comment: any, i: number) => {
        console.log(`💬 Comment ${i} by user ID:`, comment.user_id);
      });
  
      this.canEdit = post.user_id === this.currentUserId;
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
  }

  goToEdit() {
    this.router.navigate(['/edit-post', this.post.id]);
  }


  //add nessary functions for the action menu

  onDeletePost() {
    // TODO: handle post deletion
  }
  
  onReportPost(post: any) {
    // TODO: handle report
  }
  
  onHidePost(post: any) {
    // TODO: handle hiding
  }
  
  onEditComment(comment: any) {
    // TODO: handle edit comment
  }
  
  onDeleteComment(comment: any) {
    // TODO: handle delete comment
  }
  
  onReportComment(comment: any) {
    // TODO: handle report comment
  }
  
  onHideComment(comment: any) {
    // TODO: handle hide comment
  }
  
}