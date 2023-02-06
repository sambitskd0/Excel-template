import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSmartClassComponent } from './view-smart-class.component';

describe('ViewSmartClassComponent', () => {
  let component: ViewSmartClassComponent;
  let fixture: ComponentFixture<ViewSmartClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSmartClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSmartClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
