import { TestBed } from '@angular/core/testing';

import { ServerSideErrorInterceptor } from './server-side-error.interceptor';

describe('ServerSideErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ServerSideErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ServerSideErrorInterceptor = TestBed.inject(ServerSideErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
