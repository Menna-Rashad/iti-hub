import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';  // ✅ Import Mentor Dashboard
import { MentorGuard } from './auth/mentor.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },
  {
    path: 'mentor/dashboard',
    component: MentorDashboardComponent,
    canActivate: [MentorGuard],  // إضافة الحماية على هذا المسار
    title: 'Mentor Dashboard'  // ✅ Add Mentor Dashboard Route with Title
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: '**', redirectTo: 'login', pathMatch: 'full' }  
];
