import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }
}
