import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWardVillageComponent } from './edit-ward-village.component';

describe('EditWardVillageComponent', () => {
  let component: EditWardVillageComponent;
  let fixture: ComponentFixture<EditWardVillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWardVillageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWardVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
