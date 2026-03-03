import { TestBed } from '@angular/core/testing';

import { CreditProcessorService } from './credit-processor.service';

describe('CreditProcessorService', () => {
  let service: CreditProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
