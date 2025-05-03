import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  searchTerm: string = '';
  selectedTicket: any = null;
  showModal: boolean = false;
  adminReplyMessage: string = '';
  showReplyBox: boolean = false;
  ticketReplies: any[] = [];
  adminReplyAttachments: File[] = [];
  selectedStatus: string = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.adminService.getAllSupportTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.filteredTickets = data;
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
      }
    });
  }
  // getSelectValue(event: Event): string {
  //   return (event.target as HTMLSelectElement).value;
  // }
  
  getSelectValue(event: Event): string {
    const target = event.target as HTMLSelectElement;
    return target.value;
  }
  openModal(ticket: any) {
    this.selectedTicket = ticket;
    this.showModal = true;
    
    this.adminService.getTicketReplies(ticket.id).subscribe({
      next: (data) => {
        this.ticketReplies = data.replies;
      },
      error: (err) => {
        console.error('Error fetching replies:', err);
        this.ticketReplies = [];
      }
    });
  }
  
  
  filterTickets() {
    const term = this.searchTerm.toLowerCase();
    const status = this.selectedStatus.toLowerCase();
  
    this.filteredTickets = this.tickets.filter(ticket =>
      (ticket.title?.toLowerCase().includes(term) || ticket.status?.toLowerCase().includes(term)) &&
      (status ? ticket.status.toLowerCase() === status : true)
    );
  }
  
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.adminReplyAttachments = Array.from(input.files);
    }
  }
  
  extractFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }
 
  clearSearch() {
    this.searchTerm = '';
    this.filteredTickets = this.tickets;
  }

  isImage(fileUrl: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  }

extractFileUrl(filePath: string): string {
  if (!filePath.startsWith('http')) {
    return `http://localhost:8000/storage/${filePath}`;
  }
  return filePath;
}


  closeModal() {
    this.selectedTicket = null;
    this.showModal = false;
  }
  toggleReplyBox() {
    this.showReplyBox = !this.showReplyBox;
  }
  
  sendAdminReply() {
    if (!this.adminReplyMessage.trim()) {
      this.showToast('⚠️ Please type a message before sending.', false);
      return;
    }
  
    if (confirm('Are you sure you want to send this reply?')) {
      const formData = new FormData();
      formData.append('message', this.adminReplyMessage);
  
      this.adminReplyAttachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
  
      this.adminService.replyToSupportTicket(this.selectedTicket.id, formData).subscribe({
        next: (response: any) => {
          this.showToast('Reply sent successfully ✅', true);
          this.adminReplyMessage = '';
          this.adminReplyAttachments = [];
          this.showReplyBox = false;
      
          // 🟢 استخدم الرد الجاهز من الـ backend
          this.ticketReplies.push(response.reply);
        },
        error: (err) => {
          console.error('Error sending reply:', err);
          this.showToast('❌ Failed to send reply.', false);
        }
      });
      
    }
  }

  
  deleteTicket(id: number) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.adminService.deleteSupportTicket(id).subscribe({
        next: () => {
          this.loadTickets();
          this.showToast('Ticket deleted successfully ✅');
        },
        error: (err) => {
          console.error('Error deleting ticket:', err);
        }
      });
    }
  }

  updateTicketStatus(id: number, newStatus: string) {
    if (confirm(`Are you sure you want to mark this ticket as ${newStatus}?`)) {
      this.adminService.updateSupportTicketStatus(id, newStatus).subscribe({
        next: () => {
          this.loadTickets();
          this.showToast('Ticket status updated ✅');
        },
        error: (err) => {
          console.error('Error updating ticket status:', err);
        }
      });
    }
  }

  showToast(message: string, isSuccess: boolean = true) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isSuccess ? ['custom-snackbar-success'] : ['custom-snackbar-error']
    });
  }
  
}
