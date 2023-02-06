import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventmasterComponent } from './edit-eventmaster.component';

describe('EditEventmasterComponent', () => {
  let component: EditEventmasterComponent;
  let fixture: ComponentFixture<EditEventmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
