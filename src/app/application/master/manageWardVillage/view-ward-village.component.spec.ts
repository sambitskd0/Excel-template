import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWardVillageComponent } from './view-ward-village.component';

describe('ViewWardVillageComponent', () => {
  let component: ViewWardVillageComponent;
  let fixture: ComponentFixture<ViewWardVillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWardVillageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWardVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
