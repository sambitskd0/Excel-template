import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMdmDailyMenuComponent } from './add-mdm-daily-menu.component';

describe('AddMdmDailyMenuComponent', () => {
  let component: AddMdmDailyMenuComponent;
  let fixture: ComponentFixture<AddMdmDailyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMdmDailyMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMdmDailyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
