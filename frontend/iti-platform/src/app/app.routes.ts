import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
