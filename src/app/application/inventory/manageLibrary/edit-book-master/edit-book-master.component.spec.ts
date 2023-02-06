import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookMasterComponent } from './edit-book-master.component';

describe('EditBookMasterComponent', () => {
  let component: EditBookMasterComponent;
  let fixture: ComponentFixture<EditBookMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
