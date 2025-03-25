import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare const AOS: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  searchText: string = '';

  features = [
    {
      icon: 'assets/icons/student.svg',
      title: 'Students',
      description: 'Explore mentorship, training, and tailored content for ITI students.',
    },
    {
      icon: 'assets/icons/graduate.svg',
      title: 'Graduates',
      description: 'Connect with job opportunities, career support, and alumni events.',
    },
    {
      icon: 'assets/icons/company.svg',
      title: 'Companies',
      description: 'Discover talents, post jobs, and connect with the ITI community.',
    }
  ];

  filteredFeatures() {
    const lower = this.searchText.toLowerCase();
    return this.features.filter(f =>
      f.title.toLowerCase().includes(lower) ||
      f.description.toLowerCase().includes(lower)
    );
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 800,
      once: true,
    });
  }
}
