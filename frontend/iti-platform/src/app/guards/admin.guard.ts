import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('user_role');
    if (role === 'admin') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
