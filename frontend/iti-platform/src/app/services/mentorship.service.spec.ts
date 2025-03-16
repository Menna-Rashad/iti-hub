import { TestBed } from '@angular/core/testing';

import { MentorshipService } from './mentorship.service';

describe('MentorshipService', () => {
  let service: MentorshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
