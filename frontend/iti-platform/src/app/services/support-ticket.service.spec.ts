import { TestBed } from '@angular/core/testing';

import { SupportTicketService } from './support-ticket.service';

describe('SupportTicketService', () => {
  let service: SupportTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
