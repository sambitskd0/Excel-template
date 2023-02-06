import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoUpdateRequestComponent } from './auto-update-request.component';

describe('AutoUpdateRequestComponent', () => {
  let component: AutoUpdateRequestComponent;
  let fixture: ComponentFixture<AutoUpdateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoUpdateRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoUpdateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
