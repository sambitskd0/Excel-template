import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncentiveConfigurationComponent } from './add-incentive-configuration.component';

describe('AddIncentiveConfigurationComponent', () => {
  let component: AddIncentiveConfigurationComponent;
  let fixture: ComponentFixture<AddIncentiveConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncentiveConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncentiveConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
