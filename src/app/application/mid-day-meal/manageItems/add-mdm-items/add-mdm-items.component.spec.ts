import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMdmItemsComponent } from './add-mdm-items.component';

describe('AddMdmItemsComponent', () => {
  let component: AddMdmItemsComponent;
  let fixture: ComponentFixture<AddMdmItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMdmItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMdmItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
