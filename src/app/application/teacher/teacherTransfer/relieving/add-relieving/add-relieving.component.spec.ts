import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelievingComponent } from './add-relieving.component';

describe('AddRelievingComponent', () => {
  let component: AddRelievingComponent;
  let fixture: ComponentFixture<AddRelievingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRelievingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelievingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
