import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentFormComponent } from './comment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommentFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit comment content when form is submitted', () => {
    const testComment = 'Test comment';
    spyOn(component.commentSubmitted, 'emit');
    
    component.commentForm.get('content')?.setValue(testComment);
    component.onSubmit();
    
    expect(component.commentSubmitted.emit).toHaveBeenCalledWith(testComment);
  });

  it('should not emit when form is invalid', () => {
    spyOn(component.commentSubmitted, 'emit');
    
    component.commentForm.get('content')?.setValue('');
    component.onSubmit();
    
    expect(component.commentSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should show loading spinner when submitting', () => {
    component.submitting = true;
    fixture.detectChanges();
    
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should disable submit button when submitting', () => {
    component.submitting = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });
}); 