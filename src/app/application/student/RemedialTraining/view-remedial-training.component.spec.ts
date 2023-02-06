import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRemedialTrainingComponent } from './view-remedial-training.component';

describe('ViewRemedialTrainingComponent', () => {
  let component: ViewRemedialTrainingComponent;
  let fixture: ComponentFixture<ViewRemedialTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRemedialTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRemedialTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
