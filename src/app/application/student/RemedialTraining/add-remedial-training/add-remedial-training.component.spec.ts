import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemedialTrainingComponent } from './add-remedial-training.component';

describe('AddRemedialTrainingComponent', () => {
  let component: AddRemedialTrainingComponent;
  let fixture: ComponentFixture<AddRemedialTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemedialTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemedialTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
