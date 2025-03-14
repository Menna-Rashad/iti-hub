import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';  // Importing required functions
import { provideRouter } from '@angular/router';  // Importing the router configuration function

import { routes } from './app.routes';  // Importing routes from the app.routes.ts file

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Enabling change detection coalescing
    provideRouter(routes)  // Providing the router configuration
  ]
};
