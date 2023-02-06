import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncentiveConfigurationComponent } from './edit-incentive-configuration.component';

describe('EditIncentiveConfigurationComponent', () => {
  let component: EditIncentiveConfigurationComponent;
  let fixture: ComponentFixture<EditIncentiveConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIncentiveConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncentiveConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
