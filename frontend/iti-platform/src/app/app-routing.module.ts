import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ استيراد الصفحات
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
// import { OpenProjectListComponent } from './components/open-project-list/open-project-list.component';
// import { MainContentComponent } from './main-content/main-content.component';

const routes: Routes = [
  // ✅ صفحات الدخول والتسجيل
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ المنتدى والبقية
  { path: 'forum', component: PostListComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'post/:id', component: PostDetailComponent },

  // ✅ تحويل افتراضي إلى login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // ✅ لو فيه صفحة غير معروفة
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
