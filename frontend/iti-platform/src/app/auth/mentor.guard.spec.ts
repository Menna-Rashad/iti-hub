import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mentorGuard } from './mentor.guard';

describe('mentorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mentorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
