import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLibraryattendanceComponent } from './view-libraryattendance.component';

describe('ViewLibraryattendanceComponent', () => {
  let component: ViewLibraryattendanceComponent;
  let fixture: ComponentFixture<ViewLibraryattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLibraryattendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLibraryattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
