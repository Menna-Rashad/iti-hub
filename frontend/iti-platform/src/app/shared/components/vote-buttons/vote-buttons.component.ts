import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-vote-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './vote-buttons.component.html',
  styleUrls: ['./vote-buttons.component.css']
})
export class VoteButtonsComponent implements OnInit, OnChanges {
  @Input() targetType!: 'post' | 'comment' | 'job';
  @Input() targetId!: number;
  @Input() upvotes = 0;
  @Input() downvotes = 0;
  @Input() currentVote: 'upvote' | 'downvote' | null = null;

  @Output() voteUpdated = new EventEmitter<{
    targetType: 'post' | 'comment' | 'job';
    targetId: number;
    newCounts: { upvotes: number; downvotes: number };
    action: 'added' | 'removed';
  }>();

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentVote']) {
      this.currentVote = changes['currentVote'].currentValue;
    }
  }

  vote(type: 'upvote' | 'downvote'): void {
    const isTogglingOff = this.currentVote === type;

    this.voteService.handleVote(this.targetType, this.targetId, type).subscribe({
      next: (response: any) => {
        this.upvotes = response.upvotes;
        this.downvotes = response.downvotes;

        if (isTogglingOff) {
          this.currentVote = null;
        } else {
          this.currentVote = type;
        }

        this.voteUpdated.emit({
          targetType: this.targetType,
          targetId: this.targetId,
          newCounts: { upvotes: this.upvotes, downvotes: this.downvotes },
          action: isTogglingOff ? 'removed' : 'added'
        });
      },
      error: (error) => {
        console.error('Error voting:', error);
      }
    });
  }
}