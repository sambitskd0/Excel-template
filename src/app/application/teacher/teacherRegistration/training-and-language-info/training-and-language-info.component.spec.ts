import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAndLanguageInfoComponent } from './training-and-language-info.component';

describe('TrainingAndLanguageInfoComponent', () => {
  let component: TrainingAndLanguageInfoComponent;
  let fixture: ComponentFixture<TrainingAndLanguageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingAndLanguageInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAndLanguageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
