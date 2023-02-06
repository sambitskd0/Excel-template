import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSmcMemberComponent } from './view-smc-member.component';

describe('ViewSmcMemberComponent', () => {
  let component: ViewSmcMemberComponent;
  let fixture: ComponentFixture<ViewSmcMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSmcMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSmcMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
