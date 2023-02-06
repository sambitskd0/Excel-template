import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRemedialTrainingComponent } from './edit-remedial-training.component';

describe('EditRemedialTrainingComponent', () => {
  let component: EditRemedialTrainingComponent;
  let fixture: ComponentFixture<EditRemedialTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRemedialTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemedialTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
