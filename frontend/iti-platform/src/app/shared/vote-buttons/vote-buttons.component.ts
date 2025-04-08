import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { VoteService } from '../../services/vote.service';

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

  @Output() voteUpdated = new EventEmitter<any>(); // Emit when vote changes

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentVote']) {
      this.currentVote = changes['currentVote'].currentValue;
    }
  }

  vote(type: 'upvote' | 'downvote'): void {
    this.voteService.handleVote(this.targetType, this.targetId, type).subscribe({
      next: (response: any) => {
        this.upvotes = response.upvotes;
        this.downvotes = response.downvotes;

        if (response.action === 'added') {
          this.currentVote = type; // highlight the button
        } else {
          this.currentVote = null; // unhighlight if removed
        }

        // Emit the updated vote information to the parent
        this.voteUpdated.emit({
          targetType: this.targetType,
          targetId: this.targetId,
          newCounts: { upvotes: this.upvotes, downvotes: this.downvotes },
          action: response.action,
          currentVote: this.currentVote
        });
      },
      error: (err) => {
        console.error('Vote error:', err);
      }
    });
  }
}