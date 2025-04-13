import { TestBed } from '@angular/core/testing';

import { OpenProjectService } from './open-project.service';

describe('OpenProjectService', () => {
  let service: OpenProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
