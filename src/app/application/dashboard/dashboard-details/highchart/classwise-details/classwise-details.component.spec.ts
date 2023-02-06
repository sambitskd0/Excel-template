import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseDetailsComponent } from './classwise-details.component';

describe('ClasswiseDetailsComponent', () => {
  let component: ClasswiseDetailsComponent;
  let fixture: ComponentFixture<ClasswiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasswiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
