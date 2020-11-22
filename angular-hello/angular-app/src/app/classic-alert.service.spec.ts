import { TestBed } from '@angular/core/testing';

import { ClassicAlertService } from './classic-alert.service';

describe('ClassicAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassicAlertService = TestBed.get(ClassicAlertService);
    expect(service).toBeTruthy();
  });
});
