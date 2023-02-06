import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncentiveMasterComponent } from './add-incentive-master.component';

describe('AddIncentiveMasterComponent', () => {
  let component: AddIncentiveMasterComponent;
  let fixture: ComponentFixture<AddIncentiveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncentiveMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncentiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
