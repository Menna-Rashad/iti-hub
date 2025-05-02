import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts:any[]=[];
  categories:{id:number,name:string}[]=[];
  selectedPost:any=null; showModal=false;

  searchTerm=''; selectedCategory='all';

  constructor(private admin:AdminService,
              private snack:MatSnackBar){}

  ngOnInit():void{
    this.loadPosts(); this.loadCategories();
  }

  /* ---------- API ---------- */
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

  /* ---------- UI helpers ---------- */
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

  /* ---------- Delete with confirmation snackbar ---------- */
  deletePost(id:number){
    const ref=this.snack.open(
      `Delete post #${id}?`,
      'Delete',
      {
        duration:5000,
        horizontalPosition:'center',
        verticalPosition:'top',
        panelClass:['confirm-snackbar']
      }
    );

    ref.onAction().subscribe(()=>{
      /* Real call
      this.admin.deletePost(id).subscribe({
        next:()=>{ this.loadPosts(); this.toast('Post deleted ✅'); }
      });
      */
      this.posts=this.posts.filter(p=>p.id!==id);
      this.toast('Post deleted ✅');
    });
  }

  toast(msg:string){
    this.snack.open(msg,'Close',{
      duration:3000,
      verticalPosition:'top',
      panelClass:['custom-snackbar']
    });
  }
}
