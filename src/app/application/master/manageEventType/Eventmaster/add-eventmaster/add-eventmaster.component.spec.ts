import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventmasterComponent } from './add-eventmaster.component';

describe('AddEventmasterComponent', () => {
  let component: AddEventmasterComponent;
  let fixture: ComponentFixture<AddEventmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
