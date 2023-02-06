import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncentiveMasterComponent } from './edit-incentive-master.component';

describe('EditIncentiveMasterComponent', () => {
  let component: EditIncentiveMasterComponent;
  let fixture: ComponentFixture<EditIncentiveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIncentiveMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncentiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
