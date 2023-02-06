import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventtypeComponent } from './add-eventtype.component';

describe('AddEventtypeComponent', () => {
  let component: AddEventtypeComponent;
  let fixture: ComponentFixture<AddEventtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
