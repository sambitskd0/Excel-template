import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeputationStatusComponent } from './update-deputation-status.component';

describe('UpdateDeputationStatusComponent', () => {
  let component: UpdateDeputationStatusComponent;
  let fixture: ComponentFixture<UpdateDeputationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDeputationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDeputationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
