// mentor.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // استبدل بـ الخدمة المناسبة

@Injectable({
  providedIn: 'root'
})
export class MentorGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // التحقق مما إذا كان المستخدم موجه
    const userRole = localStorage.getItem('role'); // افترض أن role تم تخزينه في localStorage بعد التوثيق
    if (userRole === 'mentor') {
      return true;  // السماح بالدخول إلى الصفحة
    } else {
      this.router.navigate(['/login']);  // أو التوجيه إلى أي صفحة أخرى مثل الـ home أو صفحة خطأ
      return false;
    }
  }
}
