import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerificationRequestComponent } from './view-verification-request.component';

describe('ViewVerificationRequestComponent', () => {
  let component: ViewVerificationRequestComponent;
  let fixture: ComponentFixture<ViewVerificationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVerificationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
