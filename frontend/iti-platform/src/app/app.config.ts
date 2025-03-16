import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';  // Importing required functions
import { provideRouter } from '@angular/router';  // Importing the router configuration function

import { routes } from './app.routes';  // Importing routes from the app.routes.ts file
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Enabling change detection coalescing
    provideRouter(routes) ,provideHttpClient() // Providing the router configuration
  ]
};
