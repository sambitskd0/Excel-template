import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOtherInfoComponent } from './update-other-info.component';

describe('UpdateOtherInfoComponent', () => {
  let component: UpdateOtherInfoComponent;
  let fixture: ComponentFixture<UpdateOtherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOtherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
