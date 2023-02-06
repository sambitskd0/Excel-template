import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestMisComponent } from './best-mis.component';

describe('BestMisComponent', () => {
  let component: BestMisComponent;
  let fixture: ComponentFixture<BestMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestMisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
