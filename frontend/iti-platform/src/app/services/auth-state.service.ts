import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  setCurrentUser(user: any): void {
    this.currentUser.next(user);
  }

  loadUserFromStorage(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.currentUser.next(user);
  }
}
