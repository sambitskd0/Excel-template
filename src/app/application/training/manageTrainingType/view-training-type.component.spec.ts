import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrainingTypeComponent } from './view-training-type.component';

describe('ViewTrainingTypeComponent', () => {
  let component: ViewTrainingTypeComponent;
  let fixture: ComponentFixture<ViewTrainingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrainingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrainingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
