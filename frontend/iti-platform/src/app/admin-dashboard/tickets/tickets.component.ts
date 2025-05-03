// src/app/dashboard/support-tickets/tickets.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterModule }              from '@angular/router';
import { FormsModule }               from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ----------------------------------------------------------------------
   Confirmation Dialog: must be declared *before* TicketsComponent
   ---------------------------------------------------------------------- */
@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
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

/* ----------------------------------------------------------------------
   Main Tickets Component
   ---------------------------------------------------------------------- */
interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_review' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  created_at: string;
  attachments: string[];
}
interface Reply {
  sender_type: 'user' | 'admin';
  message: string;
  attachments: string[];
  created_at: string;
}

@Component({
  selector: 'app-support-tickets',
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
    ConfirmDialogComponent    // now valid
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchTerm = '';
  selectedStatus: Ticket['status'] | '' = '';

  selectedTicket: Ticket | null = null;
  showModal = false;

  ticketReplies: Array<{ sender_type: 'user' | 'admin'; message: string; attachments: string[]; created_at: Date }> = [];
  showReplyBox = false;
  adminReplyMessage = '';
  adminReplyAttachments: File[] = [];

  constructor(
    private admin: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  private loadTickets(): void {
    this.admin.getAllSupportTickets().subscribe({
      next: (tickets: Ticket[]) => {
        this.tickets = tickets;
        this.filteredTickets = [...tickets];
      },
      error: () => this.toast('❌ Failed to load tickets', false)
    });
  }

  filterTickets(): void {
    const t = this.searchTerm.toLowerCase();
    const s = this.selectedStatus.toLowerCase();
    this.filteredTickets = this.tickets.filter(x =>
      (x.title.toLowerCase().includes(t) || x.status.toLowerCase().includes(t)) &&
      (!s || x.status.toLowerCase() === s)
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredTickets = [...this.tickets];
  }

  openModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showModal = true;
    this.showReplyBox = false;

    this.admin.getTicketReplies(ticket.id).subscribe({
      next: (replies: Reply[]) => {
        this.ticketReplies = replies.map(r => ({
          sender_type: r.sender_type,
          message:     r.message,
          attachments: r.attachments,
          created_at:  new Date(r.created_at)
        }));
      },
      error: () => this.toast('❌ Failed to load replies', false)
    });
  }

  closeModal(): void {
    this.selectedTicket = null;
    this.showModal = false;
    this.ticketReplies = [];
  }

  toggleReplyBox(): void {
    this.showReplyBox = !this.showReplyBox;
  }

  handleFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.adminReplyAttachments = Array.from(input.files);
    }
  }

  sendAdminReply(): void {
    if (!this.adminReplyMessage.trim()) {
      this.toast('Type a message.', false);
      return;
    }
    if (!this.selectedTicket) return;

    const form = new FormData();
    form.append('message', this.adminReplyMessage.trim());
    this.adminReplyAttachments.forEach(f => form.append('attachments[]', f));

    this.admin.replyToSupportTicket(this.selectedTicket.id, form).subscribe({
      next: () => {
        this.toast('Reply sent ✅');
        this.openModal(this.selectedTicket!);  // reload replies
        this.adminReplyMessage = '';
        this.adminReplyAttachments = [];
      },
      error: () => this.toast('❌ Reply failed', false)
    });
  }

  deleteTicket(id: number): void {
    this.openConfirm(`Delete ticket #${id}?`, 'Delete').then(ok => {
      if (!ok) return;
      this.admin.deleteSupportTicket(id).subscribe({
        next: () => {
          this.toast('Ticket deleted ✅');
          this.loadTickets();
        },
        error: () => this.toast('❌ Delete failed', false)
      });
    });
  }

  updateTicketStatus(id: number, newStatus: Ticket['status']): void {
    this.openConfirm(`Mark as ${newStatus}?`, 'Update').then(ok => {
      if (!ok) return;
      this.admin.updateSupportTicketStatus(id, newStatus).subscribe({
        next: () => {
          this.toast('Status updated ✅');
          this.loadTickets();
        },
        error: () => this.toast('❌ Update failed', false)
      });
    });
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  extractFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  extractFileUrl(path: string): string {
    return path.startsWith('http')
      ? path
      : `http://localhost:8000/storage/${path}`;
  }

  private toast(msg: string, ok = true): void {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ok ? ['custom-snackbar-success'] : ['custom-snackbar-error']
    });
  }

  private openConfirm(message: string, okText: string): Promise<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message, okText }
    }).afterClosed().toPromise();
  }

  trackTicket(_: number, t: Ticket): number {
    return t.id;
  }
}
