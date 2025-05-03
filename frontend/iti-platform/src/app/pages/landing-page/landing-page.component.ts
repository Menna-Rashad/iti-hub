import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingService } from '../../services/landing.service';
import { HttpClientModule } from '@angular/common/http';

// Interface للـ news item يعكس هيكلية الداتا من الـ API
interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  trackCount = 0;
  userCount = 0;
  newUsersThisMonth = 0;
  newsItems: NewsItem[] = [];

  private dataReady = {
    tracks: false,
    users: false,
    newUsers: false
  };

  constructor(private landingService: LandingService) {}

  ngOnInit(): void {
    // Get total tracks
    this.landingService.getTrackCount().subscribe(data => {
      console.log('Track count:', data.tracks_count);
      this.trackCount = data.tracks_count;
      this.dataReady.tracks = true;
      this.tryAnimateCounters();
    });

    // Get total users
    this.landingService.getTotalUsers().subscribe(data => {
      console.log('User count:', data.total_users);
      this.userCount = data.total_users;
      this.dataReady.users = true;
      this.tryAnimateCounters();
    });

    // Get new users this month
    this.landingService.getNewUsersThisMonth().subscribe(data => {
      console.log('New users this month:', data.new_users);
      this.newUsersThisMonth = data.new_users;
      this.dataReady.newUsers = true;
      this.tryAnimateCounters();
    });

    // Get news items
    this.landingService.getPublicNews().subscribe(data => {
      console.log('DATA:', data);
      this.newsItems = data; // مش data.news
    });
    
  }

  private tryAnimateCounters() {
    if (this.dataReady.tracks && this.dataReady.users && this.dataReady.newUsers) {
      const target = document.querySelector('.counter-section');

      if (target) {
        const observer = new IntersectionObserver(
          entries => {
            if (entries[0].isIntersecting) {
              // استدعاء الدالة بس لو القيمة مش صفر
              if (this.trackCount > 0) {
                animateGaugeCounter('tracksGauge', 'tracksCounter', 0, this.trackCount, 2000);
              } else {
                setGaugeToZero('tracksGauge', 'tracksCounter');
              }

              if (this.userCount > 0) {
                animateGaugeCounter('usersGauge', 'usersCounter', 0, this.userCount, 2000);
              } else {
                setGaugeToZero('usersGauge', 'usersCounter');
              }

              if (this.newUsersThisMonth > 0) {
                animateGaugeCounter('newUsersGauge', 'newUsersCounter', 0, this.newUsersThisMonth, 2000);
              } else {
                setGaugeToZero('newUsersGauge', 'newUsersCounter');
              }

              observer.disconnect(); // run once
            }
          },
          { threshold: 0.5 }
        );

        observer.observe(target);
      }
    }
  }
}

// دالة مساعدة لضبط الـ gauge والـ counter على صفر بدون animation
function setGaugeToZero(gaugeId: string, counterId: string) {
  const gauge = document.getElementById(gaugeId);
  const counter = document.getElementById(counterId);
  if (!gauge || !counter) {
    console.warn(`Element with ID ${gaugeId} or ${counterId} not found`);
    return;
  }
  gauge.setAttribute('stroke-dashoffset', '219.911'); // الـ gauge فاضي
  counter.textContent = '0';
}

// Function to animate gauge counter
function animateGaugeCounter(
  gaugeId: string,
  counterId: string,
  start: number,
  end: number,
  totalDuration: number
) {
  // التأكد إن الـ elements موجودين
  const gauge = document.getElementById(gaugeId);
  const counter = document.getElementById(counterId);
  if (!gauge || !counter) {
    console.warn(`Element with ID ${gaugeId} or ${counterId} not found`);
    return;
  }

  // التأكد إن end مش صفر و start و end مش زي بعض
  if (end <= 0 || start === end) {
    gauge.setAttribute('stroke-dashoffset', '219.911');
    counter.textContent = end.toString();
    return;
  }

  let current = start;
  const steps = Math.abs(end - start);

  // فحص إضافي للتأكد إن steps مش صفر
  if (steps === 0) {
    return;
  }

  const stepTime = totalDuration / steps;
  const totalDash = 219.911;

  const timer = setInterval(() => {
    current++;
    const progress = current / end;
    const dashOffset = totalDash * (1 - progress);
    gauge.setAttribute('stroke-dashoffset', dashOffset.toString());
    counter.textContent = current.toString();

    if (current >= end) {
      clearInterval(timer);
    }
  }, stepTime);
}