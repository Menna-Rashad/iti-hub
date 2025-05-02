import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowStateService {
  private followMap: Map<number, BehaviorSubject<boolean>> = new Map();

  set(userId: number, isFollowing: boolean): void {
    if (this.followMap.has(userId)) {
      this.followMap.get(userId)!.next(isFollowing);
    } else {
      this.followMap.set(userId, new BehaviorSubject(isFollowing));
    }
  }

  getObservable(userId: number): BehaviorSubject<boolean> {
    if (!this.followMap.has(userId)) {
      this.followMap.set(userId, new BehaviorSubject(false));
    }
    return this.followMap.get(userId)!;
  }

  getValue(userId: number): boolean {
    return this.getObservable(userId).value;
  }
}
