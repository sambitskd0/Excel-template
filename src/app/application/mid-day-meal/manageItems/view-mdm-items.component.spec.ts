import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMdmItemsComponent } from './view-mdm-items.component';

describe('ViewMdmItemsComponent', () => {
  let component: ViewMdmItemsComponent;
  let fixture: ComponentFixture<ViewMdmItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMdmItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMdmItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
