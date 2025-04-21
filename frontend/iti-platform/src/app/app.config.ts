import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      OAuthModule.forRoot(),
      ToastrModule.forRoot({
        positionClass: 'toast-top-left',
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: AuthConfig,
      useValue: {
        issuer: 'https://accounts.google.com',
        redirectUri: window.location.origin + '/login',
        clientId: '136248172784-g14vvg68t7sh2srb2oi9snebpkkhegcp.apps.googleusercontent.com',
        responseType: 'code',
        scope: 'openid profile email',
        showDebugInformation: true,
      } as AuthConfig,
    },
  ],
};