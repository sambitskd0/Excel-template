import { TestBed } from '@angular/core/testing';

import { PortalNotificationService } from './portal-notification.service';

describe('PortalNotificationService', () => {
  let service: PortalNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
