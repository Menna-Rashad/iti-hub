import { Routes } from '@angular/router';
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
import { MainContentComponent } from './main-content/main-content.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  // ✅ Auth Routes
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent),
    title: 'Register',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Forgot Password',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    title: 'Reset Password',
  },

  // ✅ Profile
  {
    path: 'profile/edit',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Edit Profile',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
    title: 'Profile',
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
  { path: 'user/dashboard', component: UserDashboardComponent, title: 'User Dashboard' },
  {
    path: 'mentor/dashboard',
    component: MentorDashboardComponent,
    canActivate: [MentorGuard],
    title: 'Mentor Dashboard',
  },
  { path: 'main-content', component: MainContentComponent, canActivate: [AuthGuard], title: 'Main Content' },

  // ✅ Forum / Posts
  { path: 'posts', component: PostListComponent, title: 'Posts' },
  { path: 'posts/create', component: CreatePostComponent, title: 'Create Post' },
  { path: 'posts/:id', component: PostDetailComponent, title: 'Post Details' },
  { path: 'posts/edit/:id', component: EditPostComponent, canActivate: [AuthGuard], title: 'Edit Post' },

  // ✅ Open Projects
  {
    path: 'open-projects',
    loadComponent: () =>
      import('./components/open-project-list/open-project-list.component').then(m => m.OpenProjectListComponent),
    title: 'Open Projects',
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
    canActivate: [AuthGuard], // دمجنا الـ Route مع الـ AuthGuard
    title: 'Edit Project',
  },
  {
    path: 'open-projects/:id',
    loadComponent: () =>
      import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    title: 'Project Details',
  },

  // ✅ Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' },
];