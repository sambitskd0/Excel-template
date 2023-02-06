import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmcMemberComponent } from './add-smc-member.component';

describe('AddSmcMemberComponent', () => {
  let component: AddSmcMemberComponent;
  let fixture: ComponentFixture<AddSmcMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSmcMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmcMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
