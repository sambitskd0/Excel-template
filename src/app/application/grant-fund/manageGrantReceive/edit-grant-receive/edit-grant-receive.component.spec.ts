import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantReceiveComponent } from './edit-grant-receive.component';

describe('EditGrantReceiveComponent', () => {
  let component: EditGrantReceiveComponent;
  let fixture: ComponentFixture<EditGrantReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
