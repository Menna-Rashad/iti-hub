import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { MentorGuard } from './mentor.guard';

describe('MentorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => MentorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
