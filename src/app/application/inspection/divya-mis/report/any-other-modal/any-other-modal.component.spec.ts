import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOtherModalComponent } from './any-other-modal.component';

describe('AnyOtherModalComponent', () => {
  let component: AnyOtherModalComponent;
  let fixture: ComponentFixture<AnyOtherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnyOtherModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOtherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
