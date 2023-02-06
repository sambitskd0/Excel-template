import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExaminationmasterComponent } from './view-examinationmaster.component';

describe('ViewExaminationmasterComponent', () => {
  let component: ViewExaminationmasterComponent;
  let fixture: ComponentFixture<ViewExaminationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExaminationmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExaminationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
