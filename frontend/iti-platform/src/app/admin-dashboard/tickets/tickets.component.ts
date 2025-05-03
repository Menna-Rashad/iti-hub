import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

/* ---------- main Tickets component ---------- */
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
    ConfirmDialogComponent
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  /* ---------- dummy tickets ---------- */
  tickets: Ticket[] = [
    { id:101, title:'Login issue', description:'Cannot log in after reset.',
      status:'open', priority:'high', category:'Authentication',
      created_at:'2025-04-10T09:30:00Z', attachments:['screenshots/login_error.png'] },
    { id:102, title:'Payment not processed', description:'Payment failed.',
      status:'in_review', priority:'medium', category:'Billing',
      created_at:'2025-04-08T14:12:00Z', attachments:[] },
    { id:103, title:'Feature request: Dark mode', description:'Add dark theme.',
      status:'closed', priority:'low', category:'Feedback',
      created_at:'2025-04-05T11:00:00Z', attachments:[] }
  ];

  /* ---------- dummy replies ---------- */
  dummyReplies: Record<number, Reply[]> = {
    101:[{sender_type:'user',message:'Screenshot attached.',
          attachments:['screenshots/login_error.png'],
          created_at:new Date('2025-04-10T10:00:00Z')}],
    102:[],
    103:[{sender_type:'admin',message:'Dark mode on roadmap!',
          attachments:[],created_at:new Date('2025-04-06T09:00:00Z')}]
  };

  /* ---------- component state ---------- */
  filteredTickets: Ticket[] = [...this.tickets];
  searchTerm=''; selectedStatus='';

  selectedTicket: Ticket|null=null;
  showModal=false;
  ticketReplies: Reply[]=[];
  showReplyBox=false;
  adminReplyMessage='';
  adminReplyAttachments:File[]=[];

  constructor(
    private admin:AdminService,
    private snack:MatSnackBar,
    private dialog:MatDialog
  ){}

  ngOnInit():void{
    /* production: this.loadTickets(); */
  }

  /* --------- filters ---------- */
  filterTickets(){
    const t=this.searchTerm.toLowerCase();
    const s=this.selectedStatus.toLowerCase();
    this.filteredTickets=this.tickets.filter(x=>
      (x.title.toLowerCase().includes(t)||x.status.toLowerCase().includes(t))
      && (!s||x.status.toLowerCase()===s)
    );
  }
  clearFilters(){ this.searchTerm=''; this.selectedStatus=''; this.filteredTickets=[...this.tickets]; }

  /* --------- modal ---------- */
  openModal(t:Ticket){
    this.selectedTicket=t; this.showModal=true; this.showReplyBox=false;
    this.ticketReplies=this.dummyReplies[t.id]??[];
  }
  closeModal(){ this.selectedTicket=null; this.showModal=false; }

  /* --------- reply ---------- */
  toggleReplyBox(){ this.showReplyBox=!this.showReplyBox; }
  handleFileInput(e:Event){
    const input=e.target as HTMLInputElement;
    if(input.files) this.adminReplyAttachments=Array.from(input.files);
  }
  sendAdminReply(){
    if(!this.adminReplyMessage.trim()){ this.toast('Type a message.',false); return; }
    this.ticketReplies.push({
      sender_type:'admin',
      message:this.adminReplyMessage,
      attachments:this.adminReplyAttachments.map(f=>f.name),
      created_at:new Date()
    });
    this.adminReplyMessage=''; this.adminReplyAttachments=[]; this.showReplyBox=false;
    this.toast('Reply sent ✅');
  }

  /* --------- delete (dialog) ---------- */
  deleteTicket(id:number){
    this.openConfirm(`Delete ticket #${id}?`,'Delete').then(ok=>{
      if(!ok) return;
      this.tickets=this.tickets.filter(t=>t.id!==id);
      this.filteredTickets=[...this.tickets];
      this.toast('Ticket deleted ✅');
    });
  }

  /* --------- status change (dialog) ---- */
  updateTicketStatus(id:number,newStatus:Ticket['status']){
    this.openConfirm(`Mark as ${newStatus}?`,'Update').then(ok=>{
      if(!ok) return;
      const t=this.tickets.find(x=>x.id===id); if(t) t.status=newStatus;
      this.toast('Status updated ✅');
    });
  }

  /* --------- helpers ---------- */
  isImage(u:string){ return /\.(jpg|jpeg|png|gif|webp)$/i.test(u); }
  extractFileName(p:string){ return p.split('/').pop()||p; }
  extractFileUrl(p:string){ return p.startsWith('http')?p:`http://localhost:8000/storage/${p}`; }

  toast(msg:string,ok=true){
    this.snack.open(msg,'Close',{
      duration:3000,
      verticalPosition:'top',
      panelClass: ok?['custom-snackbar-success']:['custom-snackbar-error']
    });
  }

  /* -------- confirmation wrapper ------ */
  private openConfirm(message:string, okText:string):Promise<boolean>{
    return this.dialog.open(ConfirmDialogComponent,{
      width:'360px',
      data:{message, okText}
    }).afterClosed().toPromise();
  }
}
