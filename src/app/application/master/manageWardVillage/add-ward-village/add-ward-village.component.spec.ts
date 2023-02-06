import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWardVillageComponent } from './add-ward-village.component';

describe('AddWardVillageComponent', () => {
  let component: AddWardVillageComponent;
  let fixture: ComponentFixture<AddWardVillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWardVillageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWardVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
