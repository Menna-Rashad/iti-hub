import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job',
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
