import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExaminationmasterComponent } from './add-examinationmaster.component';

describe('AddExaminationmasterComponent', () => {
  let component: AddExaminationmasterComponent;
  let fixture: ComponentFixture<AddExaminationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExaminationmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExaminationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
