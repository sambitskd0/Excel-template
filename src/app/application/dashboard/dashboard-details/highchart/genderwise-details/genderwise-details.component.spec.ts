import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderwiseDetailsComponent } from './genderwise-details.component';

describe('GenderwiseDetailsComponent', () => {
  let component: GenderwiseDetailsComponent;
  let fixture: ComponentFixture<GenderwiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderwiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderwiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
