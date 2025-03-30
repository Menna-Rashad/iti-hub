import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { JobComponent } from './jobs/jobs.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AuthGuard } from './guards/auth.guard';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';
import { MentorGuard } from './auth/mentor.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { MainContentComponent } from './main-content/main-content.component'; // Import MainContentComponent

export const routes: Routes = [
  // ✅ Auth Routes
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // ✅ Profile
  { path: 'profile/edit', component: ProfileComponent, title: 'Edit Profile' },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
    title: 'Profile'
  },

  // ✅ Main Pages
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home',
  },

  { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },

  {
    path: 'mentor/dashboard',
    component: MentorDashboardComponent,
    canActivate: [MentorGuard],
    title: 'Mentor Dashboard'
  },

  // ✅ Main Content Route (After login)
  { path: 'main-content', component: MainContentComponent, canActivate: [AuthGuard], title: 'Main Content' },

  // ✅ Forum / Posts
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: CreatePostComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },

  // ✅ Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
