import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventtypeComponent } from './edit-eventtype.component';

describe('EditEventtypeComponent', () => {
  let component: EditEventtypeComponent;
  let fixture: ComponentFixture<EditEventtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
