import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

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
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
      title: 'Empowering Tech Students',
      text: 'Explore tracks, mentorship, and community for ITI students.',
      link: '/mentorship'
    },
    {
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
      title: 'Career Development',
      text: 'Your future starts with guidance and tools.',
      link: '/jobs'
    },
    {
      image: 'https://images.unsplash.com/photo-1573164574511-73c773193279?auto=format&fit=crop&w=1200&q=80'
,
      title: 'Friendship & Collaboration',
      text: 'Connect, collaborate, and grow together.',
      link: '/community'
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
    AOS.init({ duration: 800, once: true });

    new Swiper('.mySwiper', {
      modules: [Autoplay, Pagination, Navigation],
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }
}
