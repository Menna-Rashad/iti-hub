import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardNewComponent } from './admin-dashboard-new/admin-dashboard-new.component';

// Auth Pages
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

// Main Pages
import { MentorshipComponent } from './mentorship/mentorship.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { MentorGuard } from './auth/mentor.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // 🔵 MAIN Layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent), title: 'ITIHub' },
      { path: 'about', loadComponent: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent) },
      { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
      { path: 'community', component: MainContentComponent, canActivate: [AuthGuard], title: 'Community' },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/create', component: CreatePostComponent, canActivate: [AuthGuard] },
      { path: 'posts/:id', component: PostDetailComponent },
      { path: 'posts/edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },
      { path: 'open-projects', loadComponent: () => import('./components/open-project-list/open-project-list.component').then(m => m.OpenProjectListComponent) },
      { path: 'open-projects/add', loadComponent: () => import('./components/add-project/add-project.component').then(m => m.AddProjectComponent), canActivate: [AuthGuard] },
      { path: 'open-projects/edit/:id', loadComponent: () => import('./components/edit-project.component').then(m => m.EditProjectComponent), canActivate: [AuthGuard] },
      { path: 'open-projects/:id', loadComponent: () => import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent), title: 'Project Details' },
      { path: 'profile', loadComponent: () => import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent), title: 'Profile' },
      { path: 'profile/edit', component: ProfileComponent, canActivate: [AuthGuard], title: 'Edit Profile' },
      { path: 'user/dashboard', component: UserDashboardComponent, title: 'User Dashboard' },
      { path: 'mentor/dashboard', component: MentorDashboardComponent, canActivate: [MentorGuard], title: 'Mentor Dashboard' },
      { path: 'support', loadComponent: () => import('./technical-support/technical-support.component').then(m => m.TechnicalSupportComponent), title: 'Support' },
      { path: 'user/:id', loadComponent: () => import('./components/public-profile/public-profile.component').then(m => m.PublicProfileComponent), title: 'User Profile' },
      {
        path: 'support/tickets/:id',
        loadComponent: () => import('./support-ticket/ticket-detail.component').then(m => m.TicketDetailComponent)
      }
            

    ]
  },

  // 🔴 ADMIN Layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin-dashboard/statistics/statistics.component').then(m => m.StatisticsComponent) },
      { path: 'users', loadComponent: () => import('./admin-dashboard/users/users.component').then(m => m.UsersComponent) },
      { path: 'posts', loadComponent: () => import('./admin-dashboard/posts/posts.component').then(m => m.PostsComponent) },
      { path: 'comments', loadComponent: () => import('./admin-dashboard/comments/comments.component').then(m => m.CommentsComponent) },
      { path: 'tickets', loadComponent: () => import('./admin-dashboard/tickets/tickets.component').then(m => m.TicketsComponent) },
      { path: 'logs', loadComponent: () => import('./admin-dashboard/logs/logs.component').then(m => m.LogsComponent) }
    ]
  }
  ,
  

  // 🟣 AUTH Layout
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

  // 🛑 Catch All
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
