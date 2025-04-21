import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobComponent implements OnInit {
  jobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe((data) => {
      this.jobs = data;
    });
  }
}
