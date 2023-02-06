import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDamageLostItemComponent } from './add-damage-lost-item.component';

describe('AddDamageLostItemComponent', () => {
  let component: AddDamageLostItemComponent;
  let fixture: ComponentFixture<AddDamageLostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDamageLostItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDamageLostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
