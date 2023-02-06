import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserMisComponent } from './view-user-mis.component';

describe('ViewUserMisComponent', () => {
  let component: ViewUserMisComponent;
  let fixture: ComponentFixture<ViewUserMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserMisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
