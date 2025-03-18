import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');

    if (token && role === 'admin') {
      return true; // ✅ Admin can access
    }

    // ❌ Redirect unauthorized users
    this.router.navigate(['/login']);
    return false;
  }
}
