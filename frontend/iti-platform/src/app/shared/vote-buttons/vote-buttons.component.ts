import { Component, Input } from '@angular/core';
import { VoteService } from '../../services/vote.service'; 

@Component({
  selector: 'app-vote-buttons',
  template: `
    <div class="vote-container">
      <button mat-icon-button (click)="vote('upvote')">
        <mat-icon [color]="currentVote === 'upvote' ? 'primary' : 'inherit'">arrow_upward</mat-icon>
      </button>
      <span>{{ upvotes - downvotes }}</span>
      <button mat-icon-button (click)="vote('downvote')">
        <mat-icon [color]="currentVote === 'downvote' ? 'warn' : 'inherit'">arrow_downward</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./vote-buttons.component.css'] 
})
export class VoteButtonsComponent {
  @Input() targetType!: 'post' | 'comment';
  @Input() targetId!: string;
  @Input() upvotes = 0;
  @Input() downvotes = 0;
  currentVote: 'upvote' | 'downvote' | null = null;

  constructor(private voteService: VoteService) { }

  vote(type: 'upvote' | 'downvote'): void {
    this.voteService.handleVote(this.targetType, this.targetId, type).subscribe({
      next: (response: any) => {
        this.upvotes = response.upvotes;
        this.downvotes = response.downvotes;
        this.currentVote = response.action === 'added' ? type : null;
      }
    });
  }
}