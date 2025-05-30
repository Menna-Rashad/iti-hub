import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent {
  @Input() ownerId!: number;
  @Input() currentUserId!: number;
  @Input() type: 'post' | 'comment' = 'post';

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() report = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  get isOwner(): boolean {
  //   console.log('ownerId:', this.ownerId);
  // console.log('currentUserId:', this.currentUserId);
  // console.log('isOwner:', this.isOwner);
    return this.ownerId === this.currentUserId;
  }
}