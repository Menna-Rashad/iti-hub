import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

// Auth Pages
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

// Main Pages
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { JobComponent } from './jobs/jobs.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MainContentComponent } from './main-content/main-content.component';
import { EditProjectComponent } from './components/edit-project.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { MentorGuard } from './auth/mentor.guard';

export const routes: Routes = [
  // ✅ MAIN Layout Routes - لازم تيجي الأول
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home'
      },
      { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
      { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },
      { path: 'user/dashboard', component: UserDashboardComponent, title: 'User Dashboard' },
      {
        path: 'mentor/dashboard',
        component: MentorDashboardComponent,
        canActivate: [MentorGuard],
        title: 'Mentor Dashboard'
      },
      {
        path: 'main-content',
        component: MainContentComponent,
        canActivate: [AuthGuard],
        title: 'Main Content'
      },
      { path: 'profile/edit', component: ProfileComponent, title: 'Edit Profile' },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
        title: 'Profile'
      },

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
        title: 'Add Project'
      },
      {
        path: 'open-projects/edit/:id',
        loadComponent: () =>
          import('./components/edit-project.component').then(m => m.EditProjectComponent),
        title: 'Edit Project',
        canActivate: [AuthGuard]
      },
      {
        path: 'open-projects/:id',
        loadComponent: () =>
          import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
        title: 'Project Details'
      }
    ]
  },

  // ✅ AUTH Layout Routes
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
      { path: 'forgot-password', component: ResetPasswordComponent, title: 'Forgot Password' },
      { path: 'reset-password', component: ChangePasswordComponent, title: 'Reset Password' }
    ]
  },

  // ✅ Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
