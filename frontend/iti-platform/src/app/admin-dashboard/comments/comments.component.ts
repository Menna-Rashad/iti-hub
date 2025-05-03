import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';

import { AdminService } from '../../services/admin.service';

/* ---------- tiny confirm dialog ---------- */
@Component({
  standalone: true,
  imports:[MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <h2 mat-dialog-title class="d-flex align-items-center gap-2">
      <mat-icon color="warn">warning</mat-icon>
      Confirm Action
    </h2>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions class="justify-content-end gap-2">
      <button mat-stroked-button (click)="ref.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">
        {{ data.okText }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; okText: string }
  ) {}
}

/* ---------- main Comments component ---------- */
@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogComponent
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {

  /* ---------------- Dummy data ---------------- */
  posts = [
    { id: 101, title: 'Welcome to the Forum' },
    { id: 102, title: 'How to Get Started' },
    { id: 103, title: 'Community Guidelines' },
  ];

  comments = [
    { id: 5, content:'Great post! Really helped me understand the basics of the platform.',
      user:{name:'John Doe'}, post_id:101, created_at:'2025-04-03T10:15:00Z' },
    { id: 6, content:'Appreciate the insights—super useful for beginners like me.',
      user:{name:'Jane Smith'}, post_id:102, created_at:'2025-04-04T09:20:00Z' },
    { id: 7, content:'Thanks for the community guidelines—very clear and helpful!',
      user:{name:'Ali Fahmy'}, post_id:103, created_at:'2025-04-05T14:30:00Z' }
  ];

  filteredComments = [...this.comments];
  searchTerm = '';

  /* modal state */
  selectedComment: any = null;
  showModal = false;

  constructor(
    private admin: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    /* production: this.loadPosts(); this.loadComments(); */
  }

  /* --------- API placeholders (kept) --------- */
  loadPosts(){ /* ... */ }
  loadComments(){ /* ... */ }

  /* --------- Helpers & actions --------- */
  getPostTitle(id:number){ return this.posts.find(p=>p.id===id)?.title || 'Unknown Post'; }

  filterComments(){
    const t=this.searchTerm.toLowerCase();
    this.filteredComments=this.comments.filter(c=>
      c.content?.toLowerCase().includes(t) || c.user?.name?.toLowerCase().includes(t)
    );
  }
  clearSearch(){ this.searchTerm=''; this.filteredComments=[...this.comments]; }

  openModal(c:any){ this.selectedComment=c; this.showModal=true; }
  closeModal(){ this.selectedComment=null; this.showModal=false; }

  /** Delete with Cancel / Delete dialog **/
  deleteComment(id:number){
    this.openConfirm(`Delete comment #${id}?`, 'Delete').then(ok=>{
      if(!ok) return;

      /* --- production call ---
      this.admin.deleteComment(id).subscribe({
        next:()=>{ this.loadComments(); this.toast('Comment deleted ✅'); }
      });
      --------------------------------*/
      this.comments=this.comments.filter(c=>c.id!==id);
      this.filteredComments=[...this.comments];
      this.toast('Comment deleted ✅');
    });
  }

  toast(msg:string){
    this.snack.open(msg,'Close',{
      duration:3000,
      verticalPosition:'top',
      panelClass:['custom-snackbar']
    });
  }

  /* -------- confirm dialog wrapper -------- */
  private openConfirm(message:string, okText:string):Promise<boolean>{
    return this.dialog.open(ConfirmDialogComponent,{
      width:'360px',
      data:{message, okText}
    }).afterClosed().toPromise();
  }
}
