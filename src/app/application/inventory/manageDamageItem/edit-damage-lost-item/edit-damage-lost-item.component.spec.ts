import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDamageLostItemComponent } from './edit-damage-lost-item.component';

describe('EditDamageLostItemComponent', () => {
  let component: EditDamageLostItemComponent;
  let fixture: ComponentFixture<EditDamageLostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDamageLostItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDamageLostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
