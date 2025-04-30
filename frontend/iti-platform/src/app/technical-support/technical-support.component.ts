import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SupportTicketService } from '../services/support-ticket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-support',
  standalone: true,
  templateUrl: './technical-support.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./technical-support.component.css']
})
export class TechnicalSupportComponent implements OnInit {
  newTicket = {
    title: '',
    description: '',
    priority: 'medium',
    category: ''
  };
  customerTickets: any[] = [];
  replyMessage = '';
  knowledgeBase = [
    { title: 'How to reset your password', summary: 'Follow these steps to reset your account password safely.' },
    { title: 'Installing ITI software', summary: 'A step-by-step guide for downloading and installing our applications.' },
    { title: 'Troubleshooting network issues', summary: 'Common fixes for connectivity problems.' }
  ];
  customerId = 1001;

  @ViewChild('fileUpload') fileUploadRef!: ElementRef<HTMLInputElement>;
  selectedFiles: File[] = [];

  constructor(private supportTicketService: SupportTicketService) {}

  async ngOnInit() {
    await this.loadCustomerTickets();
  }

  async loadCustomerTickets() {
    try {
      const data = await this.supportTicketService.getTickets();
      this.customerTickets = data.tickets;
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }

  async submitTicket() {
    try {
      const ticketData = { ...this.newTicket };
      await this.supportTicketService.createTicket(ticketData);
      this.newTicket = { title: '', description: '', priority: 'medium', category: '' };
      this.selectedFiles = [];
      if (this.fileUploadRef) this.fileUploadRef.nativeElement.value = '';
      await this.loadCustomerTickets();
      alert('Ticket submitted successfully!');
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  }

  viewTicket(ticketId: number) {
    alert('Viewing ticket #' + ticketId);
    // You can enhance this to open a modal or route to details later
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return '#3B82F6';
      case 'closed': return '#10B981';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  }

  handleFileSelection(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }
}
