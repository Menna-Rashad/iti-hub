import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LayoutComponent } from './layout/layout.component'; // 👈 New layout component

export const routes: Routes = [
  // ❌ Auth Routes (No Navbar/Footer)
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'forgot-password', component: ResetPasswordComponent, title: 'Forgot Password' },
  { path: 'reset-password', component: ChangePasswordComponent, title: 'Reset Password' },

  // ✅ App Routes Wrapped in Layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home'
      },
      {
        path: 'profile/edit',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Edit Profile'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
        title: 'Profile'
      },
      {
        path: 'mentorship',
        loadComponent: () => import('./mentorship/mentorship.component').then(m => m.MentorshipComponent),
        title: 'Mentorship'
      },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard'
      },
      {
        path: 'user/dashboard',
        loadComponent: () => import('./pages/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
        title: 'User Dashboard'
      },
      {
        path: 'mentor/dashboard',
        loadComponent: () => import('./mentor-dashboard/mentor-dashboard.component').then(m => m.MentorDashboardComponent),
        title: 'Mentor Dashboard'
      },
      {
        path: 'main-content',
        loadComponent: () => import('./main-content/main-content.component').then(m => m.MainContentComponent),
        title: 'Main Content'
      },
      {
        path: 'community',
        loadComponent: () => import('./main-content/main-content.component').then(m => m.MainContentComponent),
        title: 'Community'
      },
      {
        path: 'posts',
        loadComponent: () => import('./components/post-list/post-list.component').then(m => m.PostListComponent)
      },
      {
        path: 'posts/create',
        loadComponent: () => import('./components/create-post/create-post.component').then(m => m.CreatePostComponent)
      },
      {
        path: 'posts/:id',
        loadComponent: () => import('./components/post-detail/post-detail.component').then(m => m.PostDetailComponent)
      },
      {
        path: 'posts/edit/:id',
        loadComponent: () => import('./components/edit-post/edit-post.component').then(m => m.EditPostComponent)
      },
      {
        path: 'open-projects',
        loadComponent: () => import('./components/open-project-list/open-project-list.component').then(m => m.OpenProjectListComponent)
      },
      {
        path: 'open-projects/add',
        loadComponent: () => import('./components/add-project/add-project.component').then(m => m.AddProjectComponent),
        title: 'Add Project'
      },
      {
        path: 'open-projects/edit/:id',
        loadComponent: () => import('./components/edit-project.component').then(m => m.EditProjectComponent),
        title: 'Edit Project'
      },
      {
        path: 'open-projects/:id',
        loadComponent: () => import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
        title: 'Project Details'
      }
    ]
  },

  // ✅ Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
