import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';

import {
  MatSnackBar, MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  MatDialog, MatDialogModule,
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';

import {
  AnnouncementService,
  News,
  CreateNewsDto,
  UpdateNewsDto
} from '../../services/announcement.service';

/* ────────────────────────────────────────────────────────────────────────── */
/*                    CONFIRM DIALOG (delete / update)                      */
/* ────────────────────────────────────────────────────────────────────────── */
@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <h2 mat-dialog-title class="d-flex align-items-center gap-2">
      <mat-icon color="warn">warning</mat-icon>
      Confirm Action
    </h2>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions class="justify-content-end gap-2">
      <button mat-stroked-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">
        {{ data.okText }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; okText: string }
  ) {}
}

/* ────────────────────────────────────────────────────────────────────────── */
/*                          CREATE ANNOUNCEMENT                             */
/* ────────────────────────────────────────────────────────────────────────── */
@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Create Announcement</h2>
    <div mat-dialog-content class="d-flex flex-column gap-3">
      <mat-form-field appearance="fill">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="title" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Content</mat-label>
        <textarea matInput rows="3" [(ngModel)]="content"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="justify-content-end gap-2">
      <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button color="primary"
              (click)="post()"
              [disabled]="!title.trim() || !content.trim()">
        Post
      </button>
    </div>
  `
})
export class CreateDialogComponent {
  title   = '';
  content = '';
  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>) {}
  post() {
    this.dialogRef.close({ title: this.title.trim(), content: this.content.trim() });
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*                          EDIT ANNOUNCEMENT                               */
/* ────────────────────────────────────────────────────────────────────────── */
@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Announcement</h2>
    <div mat-dialog-content class="d-flex flex-column gap-3">
      <mat-form-field appearance="fill">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="title" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Content</mat-label>
        <textarea matInput rows="3" [(ngModel)]="content"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="justify-content-end gap-2">
      <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button color="primary"
              (click)="save()"
              [disabled]="!title.trim() || !content.trim()">
       Save
      </button>
    </div>
  `
})
export class EditDialogComponent {
  title: string;
  content: string;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: News
  ) {
    // prefill with existing values
    this.title = data.title;
    this.content = data.content;
  }
  save() {
    this.dialogRef.close({ title: this.title.trim(), content: this.content.trim() });
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*                           MAIN ANNOUNCEMENTS VIEW                        */
/* ────────────────────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-announcements',
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

    ConfirmDialogComponent,
    CreateDialogComponent,
    EditDialogComponent
  ],
  templateUrl: './announcements.component.html',
  styleUrls:  ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  news: News[]         = [];
  filteredNews: News[] = [];
  searchTerm = '';

  /* view-modal */
  selectedNews: News | null = null;
  showModal = false;

  constructor(
    private api: AnnouncementService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  private loadNews() {
    this.api.getAll()
      .then(d => {
        this.news = d;
        this.filteredNews = [...d];
      })
      .catch(() => this.toast('❌ Couldn’t load announcements', false));
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  filterNews() {
    const t = this.searchTerm.toLowerCase();
    this.filteredNews = this.news.filter(n =>
      n.title.toLowerCase().includes(t) ||
      n.content.toLowerCase().includes(t)
    );
  }
  clearSearch() {
    this.searchTerm = '';
    this.filteredNews = [...this.news];
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  openCreateDialog() {
    this.dialog.open(CreateDialogComponent, { width: '400px' })
      .afterClosed().subscribe((res: CreateNewsDto|undefined) => {
        if (!res) return;
        this.api.create(res)
          .then(created => {
            this.news.unshift(created);
            this.filteredNews = [...this.news];
            this.toast('✅ Announcement posted');
          })
          .catch(() => this.toast('❌ Posting failed', false));
      });
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  openEditDialog(item: News) {
    this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: item
    })
    .afterClosed().subscribe((upd: UpdateNewsDto|undefined) => {
      if (!upd) return;
      this.api.update(item.id, upd)
        .then(updated => {
          // replace in local array
          const idx = this.news.findIndex(n => n.id === updated.id);
          if (idx > -1) this.news[idx] = updated;
          this.filteredNews = [...this.news];
          this.toast('✅ Saved changes');
        })
        .catch(() => this.toast('❌ Update failed', false));
    });
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  openModal(n: News)    { this.selectedNews = n; this.showModal = true; }
  closeModal()          { this.selectedNews = null; this.showModal = false; }

  /* ──────────────────────────────────────────────────────────────────────── */
  deleteNews(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message: `Delete announcement #${id}?`, okText: 'Delete' }
    })
    .afterClosed().subscribe(ok => {
      if (!ok) return;
      this.api.delete(id)
        .then(() => {
          this.loadNews();
          this.toast('✅ Deleted');
        })
        .catch(() => this.toast('❌ Delete failed', false));
    });
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  imageUrl(path: string|null|undefined): string {
    return path
      ? (path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`)
      : '';
  }

  private toast(msg: string, ok = true) {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ok ? ['custom-snackbar'] : ['custom-snackbar-error']
    });
  }
}
