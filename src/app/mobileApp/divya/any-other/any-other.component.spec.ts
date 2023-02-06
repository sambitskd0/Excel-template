import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOtherComponent } from './any-other.component';

describe('AnyOtherComponent', () => {
  let component: AnyOtherComponent;
  let fixture: ComponentFixture<AnyOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnyOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
