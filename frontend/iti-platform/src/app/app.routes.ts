import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { JobComponent } from './jobs/jobs.component'; // Your Jobs component

const isAdmin = () => localStorage.getItem('user_role') === 'admin';

// Define your routes here
export const routes: Routes = [
  { path: 'register', component: RegisterComponent,title: 'Register' }, // /register -> RegisterComponent
  { path: 'api/login', component: LoginComponent, title: 'Login'},       // /login -> LoginComponent
  { path: 'api/mentorship', component: MentorshipComponent , title: 'Mentorship' },
  { path: 'api/jobs', component: JobComponent , title: 'Jobs' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: '/api/login', pathMatch: 'full' }  // Redirect from root ('') to login page
];
