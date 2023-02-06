import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJoiningSchoolComponent } from './view-joining-school.component';

describe('ViewJoiningSchoolComponent', () => {
  let component: ViewJoiningSchoolComponent;
  let fixture: ComponentFixture<ViewJoiningSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJoiningSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJoiningSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
