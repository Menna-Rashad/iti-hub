// // ✅ app.module.ts (نهائي لمشروع هجين standalone + NgModules)
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// // Angular Material Modules
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatListModule } from '@angular/material/list';
// import { MatProgressBarModule } from '@angular/material/progress-bar';

// import { ToastrModule } from 'ngx-toastr';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AppComponent } from './app.component';
// import { PostListComponent } from './components/post-list/post-list.component';
// import { PostDetailComponent } from './components/post-detail/post-detail.component';
// import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

// import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
// import { AuthInterceptor } from './interceptors/auth.interceptor';

// @NgModule({
//   declarations: [
//     AppComponent,
//     PostListComponent,
//     PostDetailComponent,
//     UserDashboardComponent
//   ],
//   imports: [
//     BrowserModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule,
//     RouterModule,
//     MatCardModule,
//     MatButtonModule,
//     MatIconModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatMenuModule,
//     MatListModule,
//     MatProgressBarModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     SocialLoginModule,
//     ToastrModule.forRoot({
//       positionClass: 'toast-top-left',
//       timeOut: 3000,
//       closeButton: true,
//       progressBar: true,
//     })
//   ],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: AuthInterceptor,
//       multi: true
//     },
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: <SocialAuthServiceConfig>{
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('136248172784-g14vvg68t7sh2srb2oi9snebpkkhegcp.apps.googleusercontent.com')
//           }
//         ],
//         onError: (err: any) => console.error('Social Login Error:', err)
//       }
//     }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}
