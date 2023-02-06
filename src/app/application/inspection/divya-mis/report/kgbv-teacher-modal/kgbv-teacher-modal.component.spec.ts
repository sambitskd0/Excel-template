import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgbvTeacherModalComponent } from './kgbv-teacher-modal.component';

describe('KgbvTeacherModalComponent', () => {
  let component: KgbvTeacherModalComponent;
  let fixture: ComponentFixture<KgbvTeacherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KgbvTeacherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgbvTeacherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
