import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentListComponent } from './comment-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Comment } from '../../models/comment.model';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;

  const mockComments: Comment[] = [
    {
      id: 1,
      content: 'Great job posting!',
      user_id: 1,
      user_name: 'John Doe',
      user_avatar: 'avatar.jpg',
      commentable_type: 'Job',
      commentable_id: 1,
      created_at: '2024-04-12T00:00:00.000Z',
      updated_at: '2024-04-12T00:00:00.000Z'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommentListComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show no comments message when empty', () => {
    component.comments = [];
    component.loading = false;
    fixture.detectChanges();

    const noComments = fixture.nativeElement.querySelector('.no-comments');
    expect(noComments).toBeTruthy();
    expect(noComments.textContent).toContain('No comments yet');
  });

  it('should display comments when available', () => {
    component.comments = mockComments;
    component.loading = false;
    fixture.detectChanges();

    const commentCards = fixture.nativeElement.querySelectorAll('.comment-card');
    expect(commentCards.length).toBe(1);
    expect(commentCards[0].textContent).toContain('Great job posting!');
    expect(commentCards[0].textContent).toContain('John Doe');
  });

  it('should have action buttons for each comment', () => {
    component.comments = mockComments;
    component.loading = false;
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('mat-card-actions button');
    expect(actionButtons.length).toBe(3); // Like, Dislike, and Menu buttons
  });
}); 