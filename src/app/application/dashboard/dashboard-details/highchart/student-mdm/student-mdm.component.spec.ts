import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMdmComponent } from './student-mdm.component';

describe('StudentMdmComponent', () => {
  let component: StudentMdmComponent;
  let fixture: ComponentFixture<StudentMdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
