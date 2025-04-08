import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-vote-buttons',
  templateUrl: './vote-buttons.component.html',
  styleUrls: ['./vote-buttons.component.css']
})
export class VoteButtonsComponent implements OnInit, OnChanges {
  @Input() targetType!: 'post' | 'comment';
  @Input() targetId!: string;
  @Input() upvotes = 0;
  @Input() downvotes = 0;
  @Input() currentVote: 'upvote' | 'downvote' | null = null;

  @Output() voteUpdated = new EventEmitter<any>();

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentVote']) {
      this.currentVote = changes['currentVote'].currentValue;
    }
  }

  vote(type: 'upvote' | 'downvote'): void {
    // Determine if this is a toggle (removing the vote)
    const isTogglingOff = this.currentVote === type;

    this.voteService.handleVote(this.targetType, this.targetId, type).subscribe({
      next: (response: any) => {
        this.upvotes = response.upvotes;
        this.downvotes = response.downvotes;

        if (isTogglingOff) {
          // If the button was already active, remove the vote (set currentVote to null)
          this.currentVote = null;
        } else {
          // Otherwise, cast the vote and set currentVote to the new type
          this.currentVote = type;
        }

        // Emit the updated vote information to the parent
        this.voteUpdated.emit({
          targetType: this.targetType,
          targetId: this.targetId,
          newCounts: { upvotes: this.upvotes, downvotes: this.downvotes },
          action: isTogglingOff ? 'removed' : 'added',
          currentVote: this.currentVote
        });
      },
      error: (err) => {
        console.error('Vote error:', err);
      }
    });
  }
}