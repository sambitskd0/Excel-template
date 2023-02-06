import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJoiningSchoolComponent } from './add-joining-school.component';

describe('AddJoiningSchoolComponent', () => {
  let component: AddJoiningSchoolComponent;
  let fixture: ComponentFixture<AddJoiningSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJoiningSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJoiningSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
