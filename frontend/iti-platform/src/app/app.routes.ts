import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MentorshipComponent } from './mentorship/mentorship.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AuthGuard } from './guards/auth.guard';
import { EditPostComponent } from './components/edit-post/edit-post.component';
const isAdmin = () => localStorage.getItem('user_role') === 'admin';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'api/login', component: LoginComponent, title: 'Login' },
  { path: 'api/mentorship', component: MentorshipComponent, title: 'Mentorship' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: CreatePostComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },
  { path: 'posts/:id/edit', component: EditPostComponent },
  { path: '**', redirectTo: '/posts' },
];
