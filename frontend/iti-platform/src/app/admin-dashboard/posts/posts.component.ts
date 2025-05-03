/* ---------- posts.component.ts (with confirm dialog) ---------------- */
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
import { MatSelectModule } from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ---------- tiny confirm dialog ---------- */
@Component({
  standalone:true,
  imports:[MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template:`
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
export class ConfirmDialogComponent{
  constructor(
    public ref:MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{message:string;okText:string}
  ){}
}

/* ---------- main Posts component ---------- */
@Component({
  selector: 'app-posts',
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
    MatSelectModule,
    ConfirmDialogComponent        // <- include dialog
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts:any[]=[];
  categories:{id:number,name:string}[]=[];
  selectedPost:any=null; showModal=false;

  searchTerm=''; selectedCategory='all';

  constructor(
    private admin:AdminService,
    private snack:MatSnackBar,
    private dialog:MatDialog
  ){}

  ngOnInit():void{
    this.loadPosts(); this.loadCategories();
  }

  /* ------------- API loaders ---------------- */
  loadPosts(){
    this.admin.getAllPosts().subscribe({
      next:d=>this.posts=d,
      error:e=>console.error('Error loading posts',e)
    });
  }
  loadCategories(){
    this.admin.getCategories().subscribe({
      next:d=>this.categories=d,
      error:e=>console.error('Error loading categories',e)
    });
  }
  getCategoryName(id:number){
    return this.categories.find(c=>c.id===id)?.name || 'No Category';
  }

  /* ------------- UI helpers ----------------- */
  filteredPosts(){
    return this.posts.filter(p=>{
      const s=this.searchTerm.toLowerCase();
      const matchesSearch = (p.title?.toLowerCase().includes(s) ||
                             p.content?.toLowerCase().includes(s));
      const matchesCat = this.selectedCategory==='all' ||
                         this.getCategoryName(p.category_id)===this.selectedCategory;
      return matchesSearch && matchesCat;
    });
  }
  clearFilters(){ this.searchTerm=''; this.selectedCategory='all'; }

  openPostModal(p:any){ this.selectedPost=p; this.showModal=true; }
  closeModal(){ this.selectedPost=null; this.showModal=false; }

  /* ------------- Delete with dialog -------- */
  deletePost(id:number){
    this.openConfirm(`Delete post #${id}?`, 'Delete').then(ok=>{
      if(!ok) return;

      /* --- production call ---
      this.admin.deletePost(id).subscribe({
        next:()=>{ this.loadPosts(); this.toast('Post deleted ✅'); }
      });
      --------------------------------*/
      this.posts = this.posts.filter(p=>p.id!==id);
      this.toast('Post deleted ✅');
    });
  }

  /* ------------- helper toast -------------- */
  toast(msg:string){
    this.snack.open(msg,'Close',{
      duration:3000,
      verticalPosition:'top',
      panelClass:['custom-snackbar']
    });
  }

  /* ------------- confirm wrapper ----------- */
  private openConfirm(message:string, okText:string):Promise<boolean>{
    return this.dialog.open(ConfirmDialogComponent,{
      width:'360px',
      data:{message, okText}
    }).afterClosed().toPromise();
  }
}
