import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLibraryattendanceComponent } from './add-libraryattendance.component';

describe('AddLibraryattendanceComponent', () => {
  let component: AddLibraryattendanceComponent;
  let fixture: ComponentFixture<AddLibraryattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLibraryattendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLibraryattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
