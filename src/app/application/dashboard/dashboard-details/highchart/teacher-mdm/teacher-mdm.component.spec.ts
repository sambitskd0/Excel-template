import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMdmComponent } from './teacher-mdm.component';

describe('TeacherMdmComponent', () => {
  let component: TeacherMdmComponent;
  let fixture: ComponentFixture<TeacherMdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherMdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
