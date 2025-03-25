import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  profile: any;
  previewUrl: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        if (res.profile_picture) {
          this.previewUrl = `http://127.0.0.1:8000/profile_pictures/${res.profile_picture}`;
        }
      }
    });
  }
}