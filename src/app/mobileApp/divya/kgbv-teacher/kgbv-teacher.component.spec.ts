import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgbvTeacherComponent } from './kgbv-teacher.component';

describe('KgbvTeacherComponent', () => {
  let component: KgbvTeacherComponent;
  let fixture: ComponentFixture<KgbvTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KgbvTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgbvTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
