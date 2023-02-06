import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookMasterComponent } from './view-book-master.component';

describe('ViewBookMasterComponent', () => {
  let component: ViewBookMasterComponent;
  let fixture: ComponentFixture<ViewBookMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBookMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
