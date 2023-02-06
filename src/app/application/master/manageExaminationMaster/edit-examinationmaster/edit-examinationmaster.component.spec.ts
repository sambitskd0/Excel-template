import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExaminationmasterComponent } from './edit-examinationmaster.component';

describe('EditExaminationmasterComponent', () => {
  let component: EditExaminationmasterComponent;
  let fixture: ComponentFixture<EditExaminationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExaminationmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExaminationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
