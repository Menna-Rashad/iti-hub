import { Routes } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';

export const jobRoutes: Routes = [
  { path: '', component: JobListComponent, title: 'Jobs' },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/job-details/job-details.component').then((m) => m.JobDetailsComponent),
    title: 'Job Details'
  }
];
