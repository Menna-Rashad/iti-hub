import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-job-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './job-header.component.html',
  styleUrls: ['./job-header.component.css']
})
export class JobHeaderComponent {
  @Input() title!: string;
  @Input() company!: string;
  @Input() createdAt!: string;
} 