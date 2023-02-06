import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampModalComponent } from './camp-modal.component';

describe('CampModalComponent', () => {
  let component: CampModalComponent;
  let fixture: ComponentFixture<CampModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
