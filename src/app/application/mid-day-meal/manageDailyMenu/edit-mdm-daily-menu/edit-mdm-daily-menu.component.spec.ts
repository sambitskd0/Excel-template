import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMdmDailyMenuComponent } from './edit-mdm-daily-menu.component';

describe('EditMdmDailyMenuComponent', () => {
  let component: EditMdmDailyMenuComponent;
  let fixture: ComponentFixture<EditMdmDailyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMdmDailyMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMdmDailyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
