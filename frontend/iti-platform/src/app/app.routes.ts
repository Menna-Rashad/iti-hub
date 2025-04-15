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
import { MainContentComponent } from './main-content/main-content.component';
import { OpenProjectListComponent } from './components/open-project-list/open-project-list.component';
import { EditProjectComponent } from './components/edit-project.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

export const routes: Routes = [
  // ✅ Auth Routes
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'forgot-password', component: ResetPasswordComponent, title: 'Forgot Password' },
  { path: 'reset-password', component: ChangePasswordComponent, title: 'Reset Password' },

  // ✅ Profile
  { path: 'profile/edit', component: ProfileComponent, title: 'Edit Profile' },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
    title: 'Profile'
  },

  // ✅ Main Pages
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
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

  { path: 'main-content', component: MainContentComponent, canActivate: [AuthGuard], title: 'Main Content' },

  // ✅ Forum / Posts
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: CreatePostComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },

  // ✅ Open Projects
  {
    path: 'open-projects',
    loadComponent: () =>
      import('./components/open-project-list/open-project-list.component').then(m => m.OpenProjectListComponent)
  },
  {
    path: 'open-projects/add',
    loadComponent: () =>
      import('./components/add-project/add-project.component').then(m => m.AddProjectComponent),
    title: 'Add Project',
  },
  {
    path: 'open-projects/edit/:id',
    loadComponent: () =>
      import('./components/edit-project.component').then(m => m.EditProjectComponent),
    title: 'Edit Project'
  },
  {
    path: 'open-projects/:id',
    loadComponent: () =>
      import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    title: 'Project Details'
  },
  { path: 'open-projects/edit/:id', component: EditProjectComponent, canActivate: [AuthGuard] },

  // ✅ Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
