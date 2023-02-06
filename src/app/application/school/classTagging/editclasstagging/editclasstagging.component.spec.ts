import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditclasstaggingComponent } from './editclasstagging.component';

describe('EditclasstaggingComponent', () => {
  let component: EditclasstaggingComponent;
  let fixture: ComponentFixture<EditclasstaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditclasstaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditclasstaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
