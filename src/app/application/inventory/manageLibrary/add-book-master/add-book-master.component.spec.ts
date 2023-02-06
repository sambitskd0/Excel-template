import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookMasterComponent } from './add-book-master.component';

describe('AddBookMasterComponent', () => {
  let component: AddBookMasterComponent;
  let fixture: ComponentFixture<AddBookMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
