import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Provides HttpClient throughout your app.
    provideRouter(routes) // Sets up routing for your app.
  ]
})
.catch(err => console.error(err));
