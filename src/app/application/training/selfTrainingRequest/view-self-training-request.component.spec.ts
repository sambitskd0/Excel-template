import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelfTrainingRequestComponent } from './view-self-training-request.component';

describe('ViewSelfTrainingRequestComponent', () => {
  let component: ViewSelfTrainingRequestComponent;
  let fixture: ComponentFixture<ViewSelfTrainingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelfTrainingRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelfTrainingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
