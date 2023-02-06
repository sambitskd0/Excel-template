import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrantReceiveComponent } from './add-grant-receive.component';

describe('AddGrantReceiveComponent', () => {
  let component: AddGrantReceiveComponent;
  let fixture: ComponentFixture<AddGrantReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrantReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrantReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
