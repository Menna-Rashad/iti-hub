import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ---------- helper interfaces ---------- */
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
  created_at: Date;
}

@Component({
  selector: 'app-support-tickets',
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
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  /* ---------- dummy tickets ---------- */
  tickets: Ticket[] = [
    {
      id: 101,
      title: 'Login issue',
      description: 'Cannot log in after password reset.',
      status: 'open',
      priority: 'high',
      category: 'Authentication',
      created_at: '2025-04-10T09:30:00Z',
      attachments: ['screenshots/login_error.png']
    },
    {
      id: 102,
      title: 'Payment not processed',
      description: 'Payment failed but money deducted.',
      status: 'in_review',
      priority: 'medium',
      category: 'Billing',
      created_at: '2025-04-08T14:12:00Z',
      attachments: []
    },
    {
      id: 103,
      title: 'Feature request: Dark mode',
      description: 'It would be great to have a dark theme for the portal.',
      status: 'closed',
      priority: 'low',
      category: 'Feedback',
      created_at: '2025-04-05T11:00:00Z',
      attachments: []
    }
  ];

  /* ---------- dummy replies ---------- */
  dummyReplies: Record<number, Reply[]> = {
    101: [
      {
        sender_type: 'user',
        message: 'Here is a screenshot.',
        attachments: ['screenshots/login_error.png'],
        created_at: new Date('2025-04-10T10:00:00Z')
      }
    ],
    102: [],
    103: [
      {
        sender_type: 'admin',
        message: 'Dark mode now on the roadmap!',
        attachments: [],
        created_at: new Date('2025-04-06T09:00:00Z')
      }
    ]
  };

  /* ---------- component state ---------- */
  filteredTickets: Ticket[] = [...this.tickets];
  searchTerm = '';
  selectedStatus = '';

  selectedTicket: Ticket | null = null;
  showModal = false;
  ticketReplies: Reply[] = [];
  showReplyBox = false;
  adminReplyMessage = '';
  adminReplyAttachments: File[] = [];

  constructor(private admin: AdminService,
              private snack: MatSnackBar) {}

  ngOnInit(): void {
    /* For live API, comment out the dummy tickets
       and uncomment loadTickets() below */
    // this.loadTickets();
  }

  /* ------------- API loader (for production) ------------- */
  loadTickets() {
    this.admin.getAllSupportTickets().subscribe({
      next: d => { this.tickets = d; this.filteredTickets = d; },
      error: e => console.error('Error loading tickets', e)
    });
  }

  /* ------------- Filters ------------- */
  filterTickets() {
    const t = this.searchTerm.toLowerCase();
    const s = this.selectedStatus.toLowerCase();
    this.filteredTickets = this.tickets.filter(x =>
      (x.title.toLowerCase().includes(t) || x.status.toLowerCase().includes(t))
      && (s ? x.status.toLowerCase() === s : true)
    );
  }
  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredTickets = [...this.tickets];
  }

  /* ------------- Modal ------------- */
  openModal(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.showModal = true;
    this.showReplyBox = false;

    /* For live API:
    this.admin.getTicketReplies(ticket.id).subscribe({
      next: d => this.ticketReplies = d.replies,
      error: () => this.ticketReplies = []
    });
    */
    this.ticketReplies = this.dummyReplies[ticket.id] ?? [];
  }
  closeModal() { this.selectedTicket = null; this.showModal = false; }

  /* ------------- Reply ------------- */
  toggleReplyBox() { this.showReplyBox = !this.showReplyBox; }
  handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.adminReplyAttachments = Array.from(input.files);
  }
  sendAdminReply() {
    if (!this.adminReplyMessage.trim()) {
      this.toast('Type a message.', false); return;
    }
    /* Pretend send */
    this.ticketReplies.push({
      sender_type: 'admin',
      message: this.adminReplyMessage,
      attachments: this.adminReplyAttachments.map(f => f.name),
      created_at: new Date()
    });
    this.adminReplyMessage = '';
    this.adminReplyAttachments = [];
    this.showReplyBox = false;
    this.toast('Reply sent ✅');
  }

  /* ------------- Delete with confirmation ------------- */
  deleteTicket(id: number) {
    const ref = this.snack.open(
      `Delete ticket #${id}?`,
      'Delete',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['confirm-snackbar']      // blue bar, red action
      }
    );

    ref.onAction().subscribe(() => {
      /* Real call in production:
      this.admin.deleteSupportTicket(id).subscribe({
        next: () => {
          this.loadTickets();
          this.toast('Ticket deleted ✅');
        }
      });
      */
      this.tickets = this.tickets.filter(t => t.id !== id);
      this.filteredTickets = [...this.tickets];
      this.toast('Ticket deleted ✅');
    });
  }

  /* ------------- Status change with confirmation ------------- */
  updateTicketStatus(id: number, newStatus: Ticket['status']) {
    const ref = this.snack.open(
      `Mark as ${newStatus}?`,
      'Update',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['confirm-snackbar']
      }
    );

    ref.onAction().subscribe(() => {
      /* Real call for production:
      this.admin.updateSupportTicketStatus(id,newStatus).subscribe({
        next: () => this.loadTickets()
      });
      */
      const t = this.tickets.find(x => x.id === id);
      if (t) t.status = newStatus;
      this.toast('Status updated ✅');
    });
  }

  /* ------------- Helpers ------------- */
  isImage(u: string) { return /\.(jpg|jpeg|png|gif|webp)$/i.test(u); }
  extractFileName(p: string) { return p.split('/').pop() || p; }
  extractFileUrl(p: string) { return p.startsWith('http') ? p : `http://localhost:8000/storage/${p}`; }

  toast(msg: string, ok = true) {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ok ? ['custom-snackbar-success'] : ['custom-snackbar-error']
    });
  }
}
