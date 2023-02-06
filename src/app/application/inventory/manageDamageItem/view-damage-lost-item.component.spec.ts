import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDamageLostItemComponent } from './view-damage-lost-item.component';

describe('ViewDamageLostItemComponent', () => {
  let component: ViewDamageLostItemComponent;
  let fixture: ComponentFixture<ViewDamageLostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDamageLostItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDamageLostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
