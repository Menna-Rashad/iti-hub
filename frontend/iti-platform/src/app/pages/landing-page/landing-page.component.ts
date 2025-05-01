import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  ngOnInit(): void {
    const target = document.querySelector('.counter-section');
  
    if (target) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            animateGaugeCounter('tracksGauge', 'tracksCounter', 0, 30, 2000);
            animateGaugeCounter('usersGauge', 'usersCounter', 0, 1000, 2000);
            observer.disconnect(); // مش كل مرة، مرة واحدة فقط
          }
        },
        { threshold: 0.5 } // لما يظهر نص العنصر على الأقل
      );
      observer.observe(target);
    }
  }
  
}

function animateGaugeCounter(
  gaugeId: string,
  counterId: string,
  start: number,
  end: number,
  totalDuration: number
) {
  let current = start;
  const steps = Math.abs(end - start);
  if (steps === 0) return;

  const stepTime = totalDuration / steps;
  const gauge = document.getElementById(gaugeId) as unknown as SVGPathElement;
  const counter = document.getElementById(counterId) as HTMLElement;
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




