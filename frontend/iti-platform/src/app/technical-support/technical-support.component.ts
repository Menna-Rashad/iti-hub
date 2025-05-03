import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SupportTicketService } from '../services/support-ticket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TicketDetailComponent } from '../support-ticket/ticket-detail.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-technical-support',
  standalone: true,
  templateUrl: './technical-support.component.html',
  imports: [CommonModule, FormsModule, MatDialogModule],
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
  customerId = 1001;

  @ViewChild('fileUpload') fileUploadRef!: ElementRef<HTMLInputElement>;
  selectedFiles: File[] = [];

  constructor(
    private ticketService: SupportTicketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomerTickets();
  }

  viewTicket(ticketId: number) {
    this.dialog.open(TicketDetailComponent, {
      width: '600px',
      data: ticketId
    });
  }

  async loadCustomerTickets() {
    try {
      const data = await this.ticketService.getTickets();
      this.customerTickets = data;
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }

  handleFileSelection(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  async submitTicket() {
    try {
      const formData = new FormData();
      formData.append('title', this.newTicket.title);
      formData.append('description', this.newTicket.description);
      formData.append('priority', this.newTicket.priority);
      formData.append('category', this.newTicket.category);

      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('attachments[]', this.selectedFiles[i]);
      }

      await this.ticketService.createTicket(formData);
      this.newTicket = { title: '', description: '', priority: 'medium', category: '' };
      this.selectedFiles = [];
      if (this.fileUploadRef) this.fileUploadRef.nativeElement.value = '';
      await this.loadCustomerTickets();
      this.snackBar.open('Support inquiry submitted successfully.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'custom-snackbar'
      });
      } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return '#3B82F6';
      case 'closed': return '#10B981';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  }
}