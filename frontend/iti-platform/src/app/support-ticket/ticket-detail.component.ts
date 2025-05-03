// ✅ ticket-detail.component.ts
import { ActivatedRoute } from '@angular/router';
import { SupportTicketService } from '../services/support-ticket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminService } from '../services/admin.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,

  ],
  })
export class TicketDetailComponent implements OnInit {
  ticket: any = null;
  replies: any[] = [];
  newReply: string = '';
  loading = false;
  replyFiles: File[] = [];
  isDragging = false;

  @ViewChild('replyUpload') replyUploadRef!: ElementRef<HTMLInputElement>;
  @ViewChild('modalImage') modalImage!: ElementRef;

  selectedImage: string | null = null;
  isModalOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public ticketId: number,
    public dialogRef: MatDialogRef<TicketDetailComponent>,
    private ticketService: SupportTicketService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadTicket();
    this.loadReplies();
  }

  async loadTicket() {
    try {
      const response = await this.ticketService.getTicket(this.ticketId);
      this.ticket = response.ticket;
      this.replies = response.replies || [];
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    }
  }


  async loadReplies() {
    try {
      const res = await firstValueFrom(this.ticketService.getReplies(this.ticketId));
      this.replies = res?.replies ?? [];
    } catch (err) {
      console.error('Failed to load replies:', err);
      this.replies = [];
    }
  }
  
  extractFileUrl(filePath: string): string {
    if (!filePath.startsWith('http')) {
      return `http://localhost:8000/storage/${filePath}`;
    }
    return filePath;
  }
  

  handleReplyFiles(event: any) {
    this.replyFiles = Array.from(event.target.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.replyFiles = Array.from(event.dataTransfer.files);
    }
  }

  async submitReply() {
    if (!this.newReply.trim() && this.replyFiles.length === 0) return;

    const formData = new FormData();
    formData.append('message', this.newReply);

    for (let i = 0; i < this.replyFiles.length; i++) {
      formData.append('attachments[]', this.replyFiles[i]);
    }

    try {
      this.loading = true;
      await this.ticketService.addReply(this.ticketId, formData);
      this.newReply = '';
      this.replyFiles = [];
      if (this.replyUploadRef) this.replyUploadRef.nativeElement.value = '';
      await this.loadReplies();
      this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error sending reply:', error);
      this.snackBar.open('Failed to send reply.', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  openModalImage(url: string) {
    this.selectedImage = url;
    this.isModalOpen = true;
  }

  closeModalImage() {
    this.selectedImage = null;
    this.isModalOpen = false;
  }
}
